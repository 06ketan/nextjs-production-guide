import { PHASE_PRODUCTION_BUILD } from "next/constants";
import type {
  CacheHandler,
  CacheHandlerValue,
} from "next/dist/server/lib/incremental-cache";
import type {
  GetIncrementalFetchCacheContext,
  GetIncrementalResponseCacheContext,
  IncrementalCacheValue,
  SetIncrementalFetchCacheContext,
  SetIncrementalResponseCacheContext,
} from "next/dist/server/response-cache";

import { KEY_PREFIXES } from "./constants";
import {
  getRedisClientAsync,
  resetRedisClient,
  isCluster,
} from "./redis-client";
import type { RedisClusterType } from "./redis-client";
import { addKeyToTagIndex, invalidateTagAndRelatedKeys } from "./tag-manager";

const DEBUG = process?.env?.REDIS_CACHE_DEBUG === "true";

class RedisCacheHandler implements CacheHandler {
  private static redisDown = false;
  private static redisRetryUntil: number | null = null;

  constructor() {
    // Async initialization is handled by getRedisClientAsync
  }

  private isBuildPhase(): boolean {
    return process?.env?.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
  }

  private static shouldSkipReconnect(): boolean {
    if (!RedisCacheHandler.redisDown) return false;
    if (RedisCacheHandler.redisRetryUntil === null) return false;
    return Date.now() < RedisCacheHandler.redisRetryUntil;
  }

  private async getClient(): Promise<RedisClusterType | null> {
    if (RedisCacheHandler.shouldSkipReconnect()) {
      return null;
    }

    if (RedisCacheHandler.redisDown) {
      RedisCacheHandler.redisDown = false;
    }

    if (this.isBuildPhase()) {
      throw new Error("[CacheHandler] Not available during build");
    }

    try {
      // Use async initialization which handles natMap for Docker clusters
      const client = await getRedisClientAsync(10000);
      if (!client) {
        this.markRedisDown("Failed to create client");
        return null;
      }

      // Verify connectivity with ping
      if (isCluster(client)) {
        const masterNodes = client.nodes("master") || [];
        if (masterNodes.length > 0 && masterNodes[0]) {
          await masterNodes[0].ping();
        } else {
          await client.ping();
        }
      } else {
        await client.ping();
      }

      RedisCacheHandler.redisDown = false;
      RedisCacheHandler.redisRetryUntil = null;
      return client;
    } catch (error: unknown) {
      resetRedisClient();
      const msg = error instanceof Error ? error?.message : "Unknown";
      this.markRedisDown(msg);
      return null;
    }
  }

  private markRedisDown(reason?: string): void {
    const retryIntervalMs = parseInt(
      process?.env?.REDIS_RETRY_INTERVAL_MS || "60000",
      10
    );
    RedisCacheHandler.redisDown = true;
    RedisCacheHandler.redisRetryUntil = Date.now() + retryIntervalMs;
    console.error(
      `[CacheHandler] ⚠️ Redis down. Retry in ${retryIntervalMs / 1000}s. Reason: ${reason}`
    );
  }

  async get(
    key: string,
    ctx: GetIncrementalFetchCacheContext | GetIncrementalResponseCacheContext
  ): Promise<CacheHandlerValue | null> {
    if (this.isBuildPhase()) return null;

    try {
      const client = await this.getClient();
      if (!client) return null; // Redis unavailable (back-off or not configured)
      
      const redisKey = this.buildKey(key, ctx?.kind);

      if (DEBUG) console.log(`[CacheHandler] GET ${redisKey}`);

      const data = await client.get(redisKey);
      if (!data) {
        console.info(`[CacheHandler] 🟡 Miss: ${redisKey}`);
        return null;
      }

      const cachedData: CacheHandlerValue = JSON.parse(data);
      const value = cachedData?.value;
      if (!value) return null;

      if (value?.kind === "APP_PAGE") {
        // Restore rscData as Buffer (required for RSC rendering)
        if (value?.rscData) {
          // Handle both string and Buffer cases
          if (typeof value.rscData === "string") {
            value.rscData = Buffer.from(value.rscData, "utf-8") as never;
          } else if (!Buffer.isBuffer(value.rscData)) {
            value.rscData = Buffer.from(
              String(value.rscData),
              "utf-8"
            ) as never;
          }
        }
        // Restore segmentData as Map of Buffers
        if (value?.segmentData) {
          if (value.segmentData instanceof Map) {
            // Already a Map, ensure values are Buffers
            const mapEntries: [string, Buffer][] = Array.from(
              value.segmentData.entries()
            ).map(([k, v]) => [
              k,
              Buffer.isBuffer(v) ? v : Buffer.from(String(v), "utf-8"),
            ]);
            value.segmentData = new Map(mapEntries) as never;
          } else {
            // Convert object to Map
            value.segmentData = new Map(
              Object.entries(value.segmentData).map(([k, v]) => [
                k,
                Buffer.from(String(v), "utf-8"),
              ])
            ) as never;
          }
        }
      }

      if (value?.kind === "APP_ROUTE" && value?.body) {
        value.body = Buffer.from(value?.body as never, "utf-8");
      }

      return cachedData;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error?.message : "Unknown";
      // Only log non-backoff errors
      if (!msg.includes("back-off")) {
        console.error(`[CacheHandler] ❌ GET error: ${msg}`);
      }
      return null;
    }
  }

  async set(
    key: string,
    data: IncrementalCacheValue,
    ctx: SetIncrementalFetchCacheContext | SetIncrementalResponseCacheContext
  ): Promise<void> {
    if (this.isBuildPhase() || !data) return;

    try {
      const status = this.getStatus(data);
      if (typeof status === "number" && status !== 200) {
        console.info(`[CacheHandler] ⏩ Skip ${data?.kind} status ${status}`);
        return;
      }

      if (data?.kind === "APP_PAGE") {
        const contentType =
          data?.headers?.["content-type"] || data?.headers?.["Content-Type"];
        if (
          typeof contentType === "string" &&
          contentType?.includes("text/x-component")
        ) {
          return;
        }
        if (this.containsErrorState(data)) {
          console.info(`[CacheHandler] ⏩ Skip error page: ${key}`);
          return;
        }
      }

      const client = await this.getClient();
      if (!client) return; // Redis unavailable (back-off or not configured)
      
      const redisKey = this.buildKey(key, data?.kind);
      let revalidateTime = 60 * 60 * 24;
      let tags: string[] = [];

      if (data?.kind === "FETCH") {
        const fetchCtx = ctx as SetIncrementalFetchCacheContext;
        tags = fetchCtx?.tags || [];
        revalidateTime = data?.revalidate || revalidateTime;
      }

      if (data?.kind === "APP_PAGE") {
        const responseCtx = ctx as SetIncrementalResponseCacheContext;
        const cacheTagsHeader = data?.headers?.["x-next-cache-tags"] as
          | string
          | undefined;
        tags = cacheTagsHeader ? cacheTagsHeader?.split(",") : [];

        if (responseCtx?.cacheControl?.revalidate) {
          revalidateTime = responseCtx?.cacheControl?.revalidate;
        }

        if (data?.rscData) data.rscData = data?.rscData?.toString() as never;
        if (data?.segmentData) {
          data.segmentData = Object.fromEntries(
            Array.from(data?.segmentData?.entries()).map(([k, v]) => [
              k,
              v?.toString(),
            ])
          ) as never;
        }
      }

      if (data?.kind === "APP_ROUTE" && data?.body) {
        data.body = data?.body?.toString() as never;
      }

      if (DEBUG) console.log(`[CacheHandler] SET ${redisKey}`);

      await client.set(
        redisKey,
        JSON.stringify({ value: data, lastModified: Date.now(), tags }),
        "EX",
        revalidateTime
      );

      if (tags?.length > 0) {
        await addKeyToTagIndex(client, redisKey, tags, revalidateTime);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error?.message : "Unknown";
      // Only log non-backoff errors
      if (!msg.includes("back-off")) {
        console.error(`[CacheHandler] ❌ SET error: ${msg}`);
      }
    }
  }

  async revalidateTag(tag: string | string[]): Promise<void> {
    if (this.isBuildPhase()) return;

    try {
      const client = await this.getClient();
      if (!client) return; // Redis unavailable (back-off or not configured)
      
      const tagsArr = Array.isArray(tag) ? tag : [tag];
      const redisClient: RedisClusterType = client; // Type narrowing

      for (const rawTag of tagsArr) {
        if (rawTag?.includes("_N_T_")) {
          const normalizedTag = rawTag?.replace("_N_T_", "");
          const routePath = normalizedTag === "/" ? "/index" : normalizedTag;
          const tagKey = `${KEY_PREFIXES.PAGE}${routePath}`;

          const cacheData = await redisClient.get(tagKey);
          if (cacheData) {
            const parsedData = JSON.parse(cacheData);
            const pageTags =
              parsedData?.tags?.filter(
                (t: string) => !t?.startsWith("_N_T_")
              ) || [];
            for (const pageTag of pageTags) {
              await invalidateTagAndRelatedKeys(redisClient, pageTag);
            }
            await invalidateTagAndRelatedKeys(redisClient, tagKey);
          }
        } else {
          await invalidateTagAndRelatedKeys(redisClient, rawTag);
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error?.message : "Unknown";
      console.error(`[CacheHandler] ❌ revalidateTag error: ${msg}`);
    }
  }

  resetRequestCache(): void {}

  private buildKey(key: string, kind?: string): string {
    switch (kind) {
      case "APP_PAGE":
        return `${KEY_PREFIXES.PAGE}${key}`;
      case "FETCH":
        return `${KEY_PREFIXES.FETCH}${key}`;
      case "APP_ROUTE":
        return `${KEY_PREFIXES.ROUTE}${key}`;
      default:
        return `${KEY_PREFIXES.OTHERS}${key}`;
    }
  }

  private getStatus(data: IncrementalCacheValue): number | undefined {
    switch (data?.kind) {
      case "FETCH":
        return data?.data?.status;
      case "APP_PAGE":
      case "APP_ROUTE":
        return data?.status;
      default:
        return undefined;
    }
  }

  private containsErrorState(data: IncrementalCacheValue): boolean {
    if (data?.kind !== "APP_PAGE") return false;
    const rscData = data?.rscData?.toString() || "";
    const errorPatterns = [
      '"ErrorState"',
      '"error":true',
      '"success":false',
      "ErrorBoundary",
    ];
    return errorPatterns?.some((pattern) => rscData?.includes(pattern));
  }
}

module.exports = RedisCacheHandler;
