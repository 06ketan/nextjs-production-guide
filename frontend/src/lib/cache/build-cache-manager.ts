import { APP_PREFIX, BUILD_ID_KEY } from "./constants";
import {
  getRedisClientAsync,
  isCluster,
  scanAndDeleteKeys,
} from "./redis-client";

async function purgeAllCache(
  client: Parameters<typeof isCluster>[0]
): Promise<number> {
  const pattern = `${APP_PREFIX}*`;

  if (isCluster(client)) {
    const results = await Promise.all(
      client?.nodes("master")?.map((node) => scanAndDeleteKeys(node, pattern))
    );
    return results?.reduce((sum, count) => sum + count, 0);
  }

  return scanAndDeleteKeys(client, pattern);
}

export async function checkAndPurgeBuildCache(): Promise<void> {
  const currentBuildId = process?.env?.BUILD_ID || "dev";

  if (currentBuildId === "dev") {
    console.log("[BuildCache] ⏩ Skipping in dev mode");
    return;
  }

  const client = await getRedisClientAsync(5000);
  if (!client) {
    console.warn("[BuildCache] ⚠️ Redis not available");
    return;
  }

  try {
    const storedBuildId = await client?.get(BUILD_ID_KEY);
    console.log(
      `[BuildCache] Current: ${currentBuildId}, Stored: ${storedBuildId || "none"}`
    );

    if (storedBuildId === currentBuildId) {
      console.log("[BuildCache] ✅ Build ID matches");
      return;
    }

    console.log(
      `[BuildCache] 🔄 New deployment (${storedBuildId || "none"} → ${currentBuildId})`
    );

    const startTime = Date.now();
    const deletedCount = await purgeAllCache(client);
    await client?.set(BUILD_ID_KEY, currentBuildId);

    console.log(
      `[BuildCache] ✅ Purged ${deletedCount} keys in ${Date.now() - startTime}ms`
    );
  } catch (error) {
    const message = error instanceof Error ? error?.message : "Unknown error";
    console.error(`[BuildCache] ❌ Failed: ${message}`);
  }
}
