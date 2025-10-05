import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import {
  APP_PREFIX,
  getRedisClient,
  isCluster,
  scanAndDeleteKeys,
} from "@/lib/cache";

const LOCALES = ["en", "mr"] as const;

const SPECIAL_MODELS = ["fullCacheFlush"] as const;
type SpecialModel = (typeof SPECIAL_MODELS)[number];

interface StrapiWebhookPayload {
  event: string;
  model: string;
  uid?: string;
  entry?: {
    id: number;
    pathName?: string;
    slug?: string;
    uid?: string;
    locale?: string;
  };
}

interface RevalidationResponse {
  revalidated: boolean;
  count?: number;
  purgedTags?: string[];
  purgedPaths?: string[];
  message: string;
  timestamp: number;
  metadata?: {
    model?: string;
    entryId?: number;
    event?: string;
    totalEntriesBeforePurge?: number;
    operationType?: string;
  };
}

function authenticateWebhook(request: NextRequest): boolean {
  return (
    request?.headers?.get("x-webhook-secret") ===
    process.env.STRAPI_WEBHOOK_SECRET
  );
}

function isSpecialModel(model: string): model is SpecialModel {
  return SPECIAL_MODELS.includes(model as SpecialModel);
}

function sanitize(segment: string | number | undefined): string {
  if (!segment) return "";
  return String(segment)?.replace(/[^a-zA-Z0-9_-]/g, "");
}

function validatePayload(payload: Partial<StrapiWebhookPayload>): {
  isValid: boolean;
  error?: string;
} {
  if (payload?.event === "trigger-test") {
    return { isValid: true };
  }
  if (!payload?.model || typeof payload?.model !== "string") {
    return { isValid: false, error: "Invalid or missing model" };
  }
  if (!payload?.event || typeof payload?.event !== "string") {
    return { isValid: false, error: "Invalid or missing event" };
  }
  if (isSpecialModel(payload.model)) {
    return { isValid: true };
  }
  return { isValid: true };
}

const PURGE_TOLERANCE_MS = 5 * 60 * 1000;

function validatePurgeAuth(request: NextRequest): {
  isValid: boolean;
  error?: string;
} {
  const encodedToken = request.headers.get("x-purge-token");
  if (!encodedToken) return { isValid: false, error: "Missing purge token" };

  const secret = process.env.REDIS_FLUSH_AUTH_TOKEN;
  if (!secret) {
    console.warn(
      "[Revalidate] REDIS_FLUSH_AUTH_TOKEN env variable not configured"
    );
    return { isValid: false, error: "Server configuration error" };
  }

  let decodedToken: string;
  try {
    decodedToken = Buffer.from(encodedToken, "base64").toString("utf-8");
  } catch {
    return { isValid: false, error: "Invalid token encoding" };
  }

  const separatorIndex = decodedToken.indexOf("|");
  if (separatorIndex === -1)
    return { isValid: false, error: "Invalid token format" };

  const timestamp = decodedToken.slice(0, separatorIndex);
  const providedSecret = decodedToken.slice(separatorIndex + 1);

  if (providedSecret !== secret)
    return { isValid: false, error: "Invalid credentials" };

  const timestampDate = new Date(timestamp);
  if (isNaN(timestampDate.getTime()))
    return { isValid: false, error: "Invalid timestamp format" };

  if (Math.abs(Date.now() - timestampDate.getTime()) > PURGE_TOLERANCE_MS) {
    console.warn("[Revalidate] Purge auth failed - timestamp out of range:", {
      serverTime: new Date().toISOString(),
      diffMs: Math.abs(Date.now() - timestampDate.getTime()),
      toleranceMs: PURGE_TOLERANCE_MS,
    });
    return { isValid: false, error: "Token expired" };
  }

  return { isValid: true };
}

async function handleFullCacheFlush(
  request: NextRequest,
  payload: StrapiWebhookPayload
): Promise<NextResponse<RevalidationResponse>> {
  const authResult = validatePurgeAuth(request);
  if (!authResult.isValid) {
    console.warn("[Revalidate] Unauthorized fullCacheFlush attempt:", {
      model: "fullCacheFlush",
      error: authResult.error,
      hasToken: !!request.headers.get("x-purge-token"),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      {
        revalidated: false,
        message: `Unauthorized: ${authResult.error}`,
        timestamp: Date.now(),
      },
      { status: 401 }
    );
  }

  const client = getRedisClient();
  if (!client) {
    console.error(
      "[Revalidate] Full Cache Flush failed - Redis client unavailable"
    );
    return NextResponse.json(
      {
        revalidated: false,
        message: "Redis unavailable",
        timestamp: Date.now(),
      },
      { status: 503 }
    );
  }

  const pattern = `${APP_PREFIX}*`;
  const startTime = Date.now();

  try {
    let totalDeleted = 0;

    if (isCluster(client)) {
      const masterNodes = client.nodes("master");
      console.log(
        "[Revalidate] Full Cache Flush - Starting scan on all cluster nodes:",
        {
          nodeCount: masterNodes.length,
          pattern,
          model: "fullCacheFlush",
          event: payload.event,
          timestamp: new Date().toISOString(),
        }
      );
      const results = await Promise.all(
        masterNodes.map((node) => scanAndDeleteKeys(node, pattern))
      );
      totalDeleted = results.reduce((sum, count) => sum + count, 0);
    } else {
      console.log(
        "[Revalidate] Full Cache Flush - Starting scan on single Redis instance:",
        {
          pattern,
          model: "fullCacheFlush",
          event: payload.event,
          timestamp: new Date().toISOString(),
        }
      );
      totalDeleted = await scanAndDeleteKeys(client, pattern);
    }

    const duration = Date.now() - startTime;
    const nodeInfo = isCluster(client)
      ? `${client.nodes("master").length} nodes`
      : "single instance";

    console.log("[Revalidate] Full Cache Flush Complete:", {
      totalDeleted,
      nodeInfo,
      durationMs: duration,
      model: "fullCacheFlush",
      event: payload.event,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json<RevalidationResponse>({
      revalidated: true,
      count: totalDeleted,
      message: `Deleted ${totalDeleted} keys on ${nodeInfo} in ${duration}ms`,
      timestamp: Date.now(),
      metadata: {
        model: "fullCacheFlush",
        event: payload.event,
        operationType: "destructive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Revalidate] Full Cache Flush Error:", { error: message });
    return NextResponse.json(
      {
        revalidated: false,
        message: `Flush failed: ${message}`,
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

async function handleStandardRevalidation(
  payload: StrapiWebhookPayload
): Promise<NextResponse<RevalidationResponse>> {
  const { model, event, entry } = payload || {};
  const purgedTags: string[] = [];
  const purgedPaths: string[] = [];

  const sModel = sanitize(model);
  const sId = sanitize(entry?.id);
  const sUid = sanitize(entry?.slug || entry?.uid || entry?.pathName);

  // Dynamic tags based on model/id/uid
  const tags = [
    sModel,
    `${sModel}s`,
    `${sModel}s/${sId}`,
    `${sModel}s/${sUid}`,
    `${sModel}/${sId}`,
    `${sModel}/${sUid}`,
  ]?.filter((t) => t && !t?.endsWith("/"));

  tags?.forEach((tag) => {
    revalidateTag(tag);
    purgedTags?.push(tag);
  });

  console.log(`[Revalidate] Tags:`, tags);

  // Dynamic paths based on model/id/uid with locale prefixes
  const basePaths = [
    `/${sModel}`,
    `/${sModel}s`,
    `/${sModel}/${sId}`,
    `/${sModel}/${sUid}`,
    `/${sModel}s/${sId}`,
    `/${sModel}s/${sUid}`,
  ]?.filter((p) => p && !p?.endsWith("/"));

  for (const locale of LOCALES) {
    for (const basePath of basePaths) {
      const localePath = `/${locale}${basePath}`;
      revalidatePath(localePath);
      purgedPaths?.push(localePath);
    }
  }

  // Add entry's pathName if provided
  if (entry?.pathName) {
    for (const locale of LOCALES) {
      const pathName = entry?.pathName?.startsWith("/")
        ? entry?.pathName
        : `/${entry?.pathName}`;
      const localePath = `/${locale}${pathName === "/" ? "" : pathName}`;
      revalidatePath(localePath);
      if (!purgedPaths?.includes(localePath)) {
        purgedPaths?.push(localePath);
      }
    }
  }

  console.log(`[Revalidate] Complete:`, { purgedTags, purgedPaths });

  return NextResponse.json<RevalidationResponse>({
    revalidated: true,
    purgedTags,
    purgedPaths,
    count: (purgedTags?.length || 0) + (purgedPaths?.length || 0),
    message: `Revalidated ${model}`,
    timestamp: Date.now(),
    metadata: { model, entryId: entry?.id, event },
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload: StrapiWebhookPayload = await request?.json();

    // Handle fullCacheFlush separately (uses different auth)
    if (payload?.model === "fullCacheFlush") {
      const validation = validatePayload(payload);
      if (!validation?.isValid) {
        console.warn(`[Revalidate] Invalid payload: ${validation?.error}`);
        return NextResponse.json(
          { message: validation?.error },
          { status: 400 }
        );
      }
      console.log("[Revalidate] Cache purge request received:", {
        model: payload.model,
        event: payload.event,
        timestamp: new Date().toISOString(),
      });
      return handleFullCacheFlush(request, payload);
    }

    if (!authenticateWebhook(request)) {
      console.warn("[Revalidate] Unauthorized webhook attempt");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const validation = validatePayload(payload);
    if (!validation?.isValid) {
      console.warn(`[Revalidate] Invalid payload: ${validation?.error}`);
      return NextResponse.json({ message: validation?.error }, { status: 400 });
    }

    const { model, event, entry } = payload || {};

    console.log(`[Revalidate] Webhook received:`, {
      model,
      event,
      entryId: entry?.id,
      entryUid: entry?.uid || entry?.slug,
      pathName: entry?.pathName,
      timestamp: new Date()?.toISOString(),
    });

    if (!event?.includes("entry.publish") && !event?.includes("entry.update")) {
      return NextResponse.json(
        { message: "Event not handled", timestamp: Date.now() },
        { status: 200 }
      );
    }

    return handleStandardRevalidation(payload);
  } catch (error) {
    const message = error instanceof Error ? error?.message : "Unknown error";
    console.error("[Revalidate] Error:", message);

    return NextResponse.json(
      {
        revalidated: false,
        message: `Error: ${message}`,
        timestamp: Date.now(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/revalidate",
    method: "POST",
    auth: "x-webhook-secret header",
    timestamp: Date.now(),
  });
}
