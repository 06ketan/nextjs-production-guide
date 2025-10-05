"server-only";

import { PHASE_PRODUCTION_BUILD } from "next/constants";

// Smart Strapi URL resolution (same logic as client.ts)
function getStrapiUrl(): string {
  const envUrl = process.env.STRAPI_URL;

  if (!envUrl) {
    return "http://localhost:1337";
  }

  // If host.docker.internal is set, check if we're actually in Docker
  if (envUrl.includes("host.docker.internal")) {
    const isInDocker =
      process.env.DOCKER_CONTAINER === "true" ||
      process.env.IN_DOCKER === "true" ||
      !!process.env.REDIS_URL ||
      !!process.env.REDIS_CLUSTER_URLS;

    if (!isInDocker) {
      console.warn(
        "[Strapi] host.docker.internal detected but not in Docker. Using localhost:1337 instead."
      );
      return "http://localhost:1337";
    }
  }

  return envUrl;
}

const STRAPI_URL = getStrapiUrl();
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const DEBUG = process.env.STRAPI_DEBUG === "true";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export type QueryParams = Record<string, string | number | boolean | unknown[]>;

// Endpoint to tag mapping for cache invalidation
const ENDPOINT_TAG_MAP: ReadonlyMap<string, string> = new Map([
  ["posts", "posts"],
  ["pages", "pages"],
  ["about", "about"],
  ["global", "global"],
]);

function getTagFromEndpoint(endpoint: string): string {
  for (const [key, tag] of ENDPOINT_TAG_MAP) {
    if (endpoint?.includes(key)) return tag;
  }
  return (
    endpoint?.split("?")?.[0]?.replace(/^\//, "")?.replace(/\//g, "-") ||
    "strapi"
  );
}

function stringifyValue(value: unknown): string {
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}

// Logger utility
const logger = {
  request: (requestId: string, method: string, url: string) => {
    if (DEBUG) {
      console.log(`[Strapi:REQ:${requestId}] ${method} ${url}`);
    }
  },
  response: (
    requestId: string,
    status: number,
    duration: number,
    dataLength?: number
  ) => {
    const msg = `[Strapi:RES:${requestId}] ${status} - ${duration}ms`;
    if (DEBUG) {
      console.log(
        dataLength !== undefined ? `${msg} - ${dataLength} items` : msg
      );
    }
    // Always log slow requests
    if (duration > 1000) {
      console.warn(`[Strapi:SLOW:${requestId}] Request took ${duration}ms`);
    }
  },
  error: (requestId: string, error: unknown) => {
    console.error(`[Strapi:ERR:${requestId}]`, error);
  },
};

/**
 * Flatten Strapi v4 nested attributes structure
 */
export function flattenAttributes<T>(data: unknown): T {
  if (data === null || data === undefined) {
    return data as T;
  }

  if (Array.isArray(data)) {
    return data?.map((item) => flattenAttributes(item)) as T;
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    // Handle Strapi v4 data wrapper
    if ("data" in obj && obj?.data !== undefined) {
      if (obj?.data === null) return null as T;
      if (Array.isArray(obj?.data)) {
        return obj?.data?.map((item: unknown) => flattenAttributes(item)) as T;
      }
      return flattenAttributes(obj?.data) as T;
    }

    // Handle attributes wrapper
    if ("attributes" in obj && "id" in obj) {
      const { id, attributes } = obj as {
        id: number;
        attributes: Record<string, unknown>;
      };
      return { id, ...flattenAttributes(attributes) } as T;
    }

    // Recursively flatten nested objects
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = flattenAttributes(value);
    }
    return result as T;
  }

  return data as T;
}

export interface StrapiResponse<T = unknown> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Reusable Strapi fetch utility with caching, tags, and logging
 */
export async function fetchStrapi<T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
  queryParams: QueryParams = {},
  customTag?: string
): Promise<StrapiResponse<T> | null> {
  // Skip during production build to avoid fetch errors
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return null;
  }

  const requestId = Math.random().toString(36)?.substring(2, 8);
  const startTime = Date.now();

  const { method = "GET", headers = {}, body } = options || {};
  const url = new URL(`${STRAPI_URL}/api${endpoint}`);

  // Add query params
  Object.entries(queryParams || {})?.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value?.forEach((item) =>
        url?.searchParams?.append(key, stringifyValue(item))
      );
    } else {
      url?.searchParams?.append(key, stringifyValue(value));
    }
  });

  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
    ...headers,
  };

  const tag = customTag || getTagFromEndpoint(endpoint);

  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
    cache: "force-cache",
    next: {
      revalidate: 31536000,
      tags: [tag],
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  // Log request
  logger?.request(requestId, method, url?.toString());

  try {
    const response = await fetch(url?.toString(), fetchOptions);
    const duration = Date.now() - startTime;

    if (!response?.ok) {
      logger?.response(requestId, response?.status, duration);
      if (response?.status === 404) return null;
      logger?.error(
        requestId,
        `HTTP ${response?.status} ${response?.statusText}`
      );
      return null;
    }

    const jsonResp = await response?.json();
    const flattened = flattenAttributes<T>(jsonResp);

    // Calculate data length for logging
    const dataLength = Array.isArray(flattened)
      ? flattened?.length
      : flattened
        ? 1
        : 0;

    logger?.response(requestId, response?.status, duration, dataLength);

    return { data: flattened } as StrapiResponse<T>;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger?.error(requestId, error);
    logger?.response(requestId, 500, duration);
    return null;
  }
}

// API Endpoints
export const ApiEndpoints = {
  pages: "/pages",
  posts: "/posts",
  about: "/about",
  global: "/global",
} as const;
