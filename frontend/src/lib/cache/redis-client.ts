import { Cluster, Redis } from "ioredis";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export type RedisClusterType = Cluster | Redis;

declare global {
  var __REDIS_CLIENT__: RedisClusterType | null | undefined;

  var __REDIS_CLIENT_READY_PROMISE__:
    | Promise<RedisClusterType | null>
    | undefined;
}

interface AzureRedisConfig {
  host: string;
  port: number;
  password: string;
  ssl: boolean;
}

export function isCluster(client: Redis | Cluster): client is Cluster {
  return "nodes" in client && typeof client?.nodes === "function";
}

export async function scanAndDeleteKeys(
  node: Redis,
  pattern: string,
  batchSize = 100
): Promise<number> {
  let cursor = "0";
  let deletedCount = 0;

  do {
    const result = await node.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      batchSize
    );
    cursor = result?.[0] ?? "0";
    const keys = result?.[1] ?? [];

    if (keys?.length > 0) {
      const pipeline = node.pipeline();
      keys.forEach((key: string) => pipeline.del(key));
      await pipeline.exec();
      deletedCount += keys.length;
    }
  } while (cursor !== "0");

  return deletedCount;
}

function parseAzureConnectionString(
  connectionString: string
): AzureRedisConfig | null {
  try {
    const parts = connectionString?.split(",")?.map((p) => p?.trim()) ?? [];
    if (parts?.length < 2) return null;

    const [hostPort, ...options] = parts;
    const hostPortParts = hostPort?.split(":") ?? [];
    const host = hostPortParts?.[0] ?? "";
    const portStr = hostPortParts?.[1] ?? "6380";
    const port = parseInt(portStr, 10);

    const config: Record<string, string> = {};
    for (const opt of options) {
      const optParts = opt?.split("=") ?? [];
      const key = optParts?.[0];
      const valueParts = optParts?.slice(1) ?? [];
      if (key && valueParts?.length > 0) {
        config[key?.toLowerCase()] = valueParts?.join("=");
      }
    }

    return {
      host,
      port,
      password: config?.password || "",
      ssl: config?.ssl?.toLowerCase() === "true",
    };
  } catch {
    console.error("[Redis] ❌ Failed to parse Azure connection string");
    return null;
  }
}

function registerEventListeners(client: RedisClusterType, label: string): void {
  const c = client as RedisClusterType & { __listenersRegistered__?: boolean };
  if (c?.__listenersRegistered__) return;
  c.__listenersRegistered__ = true;

  client?.on("error", (err) =>
    console.error(`[Redis] ❌ ${label} Error: ${err?.message}`)
  );
  client?.on("connect", () => console.log(`[Redis] 🔗 Connected to ${label}`));
  client?.on("ready", () => console.log(`[Redis] ✅ ${label} is ready`));
  client?.on("close", () => console.log(`[Redis] 🔌 ${label} connection closed`));
  client?.on("reconnecting", () => console.log(`[Redis] 🔄 ${label} reconnecting`));
  
  if (isCluster(client)) {
    client?.on("+node", () => console.log(`[Redis] ➕ ${label} node added`));
    client?.on("-node", () => console.log(`[Redis] ➖ ${label} node removed`));
  }
}

function createAzureRedisClient(config: AzureRedisConfig): Redis | null {
  try {
    console.info(
      `[Redis] 🔵 Creating Azure Redis: ${config?.host}:${config?.port}`
    );

    const client = new Redis({
      host: config?.host,
      port: config?.port,
      password: config?.password,
      tls: config?.ssl ? { servername: config?.host } : undefined,
      maxRetriesPerRequest: 1,
      keepAlive: 10000,
      enableAutoPipelining: true,
      lazyConnect: false,
      retryStrategy: (times) =>
        times <= 3 ? Math.min(times * 1000, 3000) : null,
    });

    registerEventListeners(client, "Azure Redis");
    return client;
  } catch (error) {
    console.error("[Redis] ❌ Failed to create Azure Redis client:", error);
    return null;
  }
}

/**
 * Build natMap by connecting to each node and discovering its internal IP.
 * This handles Docker's dynamic IP assignment.
 */
async function buildNatMapFromNodes(
  nodes: { host: string; port: number }[],
  password?: string
): Promise<Record<string, { host: string; port: number }>> {
  const natMap: Record<string, { host: string; port: number }> = {};

  for (const node of nodes) {
    let tempClient: Redis | null = null;
    try {
      tempClient = new Redis({
        host: node.host,
        port: node.port,
        password,
        connectTimeout: 3000,
        maxRetriesPerRequest: 1,
        lazyConnect: false,
      });

      const clusterNodes = await tempClient.cluster("NODES");

      if (typeof clusterNodes === "string") {
        clusterNodes.split("\n").forEach((line) => {
          const parts = line.split(" ");
          if (parts.length >= 2) {
            const addrPart = parts[1]?.split("@")[0];
            if (addrPart && addrPart.includes(":")) {
              const [internalIp, internalPort] = addrPart.split(":");
              if (parts[2]?.includes("myself") && internalIp && internalPort) {
                natMap[`${internalIp}:${internalPort}`] = {
                  host: node.host,
                  port: node.port,
                };
              }
            }
          }
        });
      }
    } catch {
      // Skip nodes that fail to connect
    } finally {
      tempClient?.disconnect();
    }
  }

  return natMap;
}

/**
 * Creates Redis Cluster client with automatic natMap for Docker localhost
 */
async function createRedisClusterClientAsync(): Promise<Cluster | null> {
  try {
    const clusterUrls = process?.env?.REDIS_CLUSTER_URLS?.split(",")?.map(
      (url) => url?.trim()
    );
    if (!clusterUrls?.length) {
      console.error("[Redis] ❌ Redis cluster URLs not configured");
      return null;
    }

    console.info(
      `[Redis] 🔵 Creating Redis Cluster with ${clusterUrls?.length} nodes`
    );

    const nodes = clusterUrls?.map((url) => {
      const urlObj = new URL(url);
      return {
        host: urlObj?.hostname,
        port: parseInt(urlObj?.port || "6379", 10),
      };
    });

    const password = process?.env?.REDIS_AUTH || undefined;
    const isLocalhost = nodes.every(
      (n) => n.host === "127.0.0.1" || n.host === "localhost"
    );

    // Build natMap from env var or dynamically for localhost
    let natMap: Record<string, { host: string; port: number }> = {};
    const natMapEnv = process?.env?.REDIS_CLUSTER_NAT_MAP;

    if (natMapEnv) {
      natMapEnv.split(",").forEach((mapping) => {
        const [from, to] = mapping.split("->");
        if (from && to) {
          const [toHost, toPort] = to.split(":");
          natMap[from.trim()] = {
            host: toHost?.trim() || "127.0.0.1",
            port: parseInt(toPort?.trim() || "6379", 10),
          };
        }
      });
      console.info(`[Redis] 🔧 Using natMap from env: ${Object.keys(natMap).length} mappings`);
    } else if (isLocalhost) {
      // Dynamically build natMap for Docker localhost
      console.info("[Redis] 🔧 Building natMap for Docker localhost cluster...");
      natMap = await buildNatMapFromNodes(nodes, password);
      if (Object.keys(natMap).length > 0) {
        console.info(`[Redis] ✅ Built natMap: ${Object.keys(natMap).length} mappings`);
      }
    }

    const cluster = new Cluster(nodes, {
      redisOptions: {
        maxRetriesPerRequest: 1,
        password,
        keepAlive: 10000,
        enableAutoPipelining: true,
        connectTimeout: 10000,
        lazyConnect: false,
      },
      slotsRefreshTimeout: 2000,
      clusterRetryStrategy: (times) => (times <= 1 ? 1000 : null),
      enableReadyCheck: true,
      enableOfflineQueue: true,
      scaleReads: "master",
      natMap: Object.keys(natMap).length > 0 ? natMap : undefined,
      dnsLookup: (address, callback) => callback(null, address),
    });

    registerEventListeners(cluster, "Redis Cluster");
    return cluster;
  } catch (error) {
    console.error("[Redis] ❌ Failed to create Redis Cluster client:", error);
    return null;
  }
}


function createStandaloneRedisClient(): Redis | null {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.error("[Redis] ❌ REDIS_URL not configured");
    return null;
  }

  try {
    console.info(`[Redis] 🔵 Creating standalone Redis...`);

    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      keepAlive: 10000,
      lazyConnect: false,
      retryStrategy: (times) =>
        times <= 3 ? Math.min(times * 1000, 3000) : null,
    });

    registerEventListeners(client, "Standalone Redis");
    return client;
  } catch (error) {
    console.error(
      "[Redis] ❌ Failed to create standalone Redis client:",
      error
    );
    return null;
  }
}

function tryCreateAzureClient(
  connectionString: string | undefined,
  label: string
): Redis | null {
  if (!connectionString) return null;

  const config = parseAzureConnectionString(connectionString);
  if (!config) return null;

  const client = createAzureRedisClient(config);
  if (client) console.info(`[Redis] ✅ Using ${label} connection`);
  return client;
}

// Track async initialization state
declare global {
  var __REDIS_INIT_PROMISE__: Promise<RedisClusterType | null> | undefined;
}

/**
 * Async Redis client initialization
 * Priority order:
 * 1. Azure Redis Connection String (primary)
 * 2. Azure Redis Connection String (secondary)
 * 3. Redis Cluster URLs (with dynamic natMap for Docker)
 * 4. Standalone Redis URL
 */
async function initializeRedisClient(): Promise<RedisClusterType | null> {
  // Priority 1: Azure Redis (primary)
  const primary = tryCreateAzureClient(
    process?.env?.AZURE_REDIS_CONNECTION_STRING,
    "primary"
  );
  if (primary) return primary;

  // Priority 2: Azure Redis (secondary)
  const secondary = tryCreateAzureClient(
    process?.env?.AZURE_REDIS_CONNECTION_STRING_SECONDARY,
    "secondary"
  );
  if (secondary) return secondary;

  // Priority 3: Redis Cluster (async for natMap building)
  if (process?.env?.REDIS_CLUSTER_URLS) {
    const cluster = await createRedisClusterClientAsync();
    if (cluster) return cluster;
  }

  // Priority 4: Standalone Redis
  return createStandaloneRedisClient();
}

/**
 * Get Redis client (sync version for backward compatibility)
 * Returns existing client or null if not yet initialized
 * Use getRedisClientAsync for guaranteed initialization
 */
export const getRedisClient = (): RedisClusterType | null => {
  if (process?.env?.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return null;

  const existing = globalThis?.__REDIS_CLIENT__;
  if (existing) return existing;

  // Start async initialization if not already started
  if (!globalThis.__REDIS_INIT_PROMISE__) {
    globalThis.__REDIS_INIT_PROMISE__ = initializeRedisClient().then((client) => {
      globalThis.__REDIS_CLIENT__ = client;
      globalThis.__REDIS_INIT_PROMISE__ = undefined;
      return client;
    });
  }

  // For sync callers, return null until async init completes
  // They should use getRedisClientAsync instead
  return null;
};

export const getRedisClientAsync = async (
  timeoutMs = 5000
): Promise<RedisClusterType | null> => {
  if (process?.env?.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return null;

  // Check for existing ready client
  const existing = globalThis?.__REDIS_CLIENT__;
  if (existing?.status === "ready") return existing;

  // Wait for ongoing initialization
  if (globalThis.__REDIS_INIT_PROMISE__) {
    const client = await globalThis.__REDIS_INIT_PROMISE__;
    if (client?.status === "ready") return client;
    if (client) {
      // Wait for client to become ready
      return new Promise((resolve) => {
        const timeout = setTimeout(() => resolve(client), timeoutMs);
        client.once("ready", () => {
          clearTimeout(timeout);
          resolve(client);
        });
        client.once("error", () => {
          clearTimeout(timeout);
          resolve(null);
        });
      });
    }
    return null;
  }

  // Start initialization
  globalThis.__REDIS_INIT_PROMISE__ = initializeRedisClient();
  const client = await globalThis.__REDIS_INIT_PROMISE__;
  globalThis.__REDIS_CLIENT__ = client;
  globalThis.__REDIS_INIT_PROMISE__ = undefined;

  if (!client) return null;
  if (client.status === "ready") return client;

  // Wait for client to become ready
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(client), timeoutMs);
    client.once("ready", () => {
      clearTimeout(timeout);
      resolve(client);
    });
    client.once("error", () => {
      clearTimeout(timeout);
      resolve(null);
    });
  });
};

export const resetRedisClient = async (): Promise<void> => {
  const client = globalThis?.__REDIS_CLIENT__;
  if (client) {
    try {
      client?.removeAllListeners();
      await client?.quit();
    } catch {
      try {
        client?.disconnect();
      } catch {
        /* ignore */
      }
    }
  }
  globalThis.__REDIS_CLIENT__ = null;
  globalThis.__REDIS_CLIENT_READY_PROMISE__ = undefined;
};

// Graceful shutdown handlers
if (
  typeof process !== "undefined" &&
  process?.env?.NEXT_PHASE !== PHASE_PRODUCTION_BUILD
) {
  const shutdown = async () => {
    console.log("[Redis] Shutting down connection...");
    await resetRedisClient();
  };
  process?.on("SIGTERM", shutdown);
  process?.on("SIGINT", shutdown);
}
