import { KEY_PREFIXES } from "./constants";
import type { RedisClusterType } from "./redis-client";

export async function addKeyToTagIndex(
  client: RedisClusterType,
  key: string,
  keyTags: string[],
  expiry: number
): Promise<void> {
  const tags = keyTags?.filter((tag) => !tag?.startsWith("_N_T_")) || [];
  if (!tags?.length) return;

  try {
    for (const tag of tags) {
      if (!tag) continue;
      const tagIndexKey = `${KEY_PREFIXES.TAG_INDEX}${tag}`;
      const allTagIndexKey = `${KEY_PREFIXES.TAG_INDEX}ALL`;

      await client?.sadd(tagIndexKey, key);
      await client?.expire(tagIndexKey, expiry);
      await client?.sadd(allTagIndexKey, key);
      await client?.sadd(allTagIndexKey, tagIndexKey);
      await client?.expire(allTagIndexKey, expiry);
    }
  } catch (error) {
    console.error("[TagManager] Error adding key to tag index:", error);
  }
}

export async function invalidateTagAndRelatedKeys(
  client: RedisClusterType,
  tag: string
): Promise<void> {
  if (!tag) return;

  const tagIndexKey = `${KEY_PREFIXES.TAG_INDEX}${tag}`;

  try {
    const keysToInvalidate = (await client?.smembers(tagIndexKey)) || [];
    await client?.del(tagIndexKey);
    for (const pageTag of keysToInvalidate) {
      await client?.del(pageTag);
    }
  } catch (error) {
    console.error(`[TagManager] Error invalidating tag ${tag}:`, error);
  }
}
