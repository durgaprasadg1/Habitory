import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const CACHE_PREFIX = "habit-tracker:v1";

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

let isConnected = false;
let connectionPromise = null;
let lastConnectionFailureAt = 0;
const RETRY_AFTER_FAILURE_MS = 30 * 1000;

export async function connectRedis() {
  try {
    if (isConnected || redisClient.isReady) {
      isConnected = true;
      return true;
    }

    const now = Date.now();
    if (
      !isConnected &&
      lastConnectionFailureAt &&
      now - lastConnectionFailureAt < RETRY_AFTER_FAILURE_MS
    ) {
      return false;
    }

    if (!connectionPromise) {
      connectionPromise = redisClient
        .connect()
        .then(() => {
          isConnected = true;
          console.log("Redis connected");
          return true;
        })
        .catch((error) => {
          isConnected = false;
          lastConnectionFailureAt = Date.now();
          console.error("Redis connection failed:", error.message);
          return false;
        })
        .finally(() => {
          connectionPromise = null;
        });
    }

    const connected = await connectionPromise;
    if (connected) {
      isConnected = true;
    }

    return connected;
  } catch (error) {
    isConnected = false;
    lastConnectionFailureAt = Date.now();
    console.error("Redis connection failed:", error.message);
    return false;
  }
}

export async function getJsonCache(key) {
  try {
    const connected = await connectRedis();
    if (!connected) return null;

    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Redis GET error [${key}]:`, error.message);
    return null;
  }
}

export async function setJsonCache(key, value, ttlSeconds = 600) {
  try {
    const connected = await connectRedis();
    if (!connected) return false;

    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Redis SET error [${key}]:`, error.message);
    return false;
  }
}

export async function deleteCacheKeys(keys = []) {
  try {
    const connected = await connectRedis();
    if (!connected) return;
    if (!keys.length) return;

    // Ensure all keys are strings and call del with spread to pass them as separate args
    const stringKeys = keys.map(String).filter(Boolean);
    if (!stringKeys.length) return;
    await redisClient.del(...stringKeys);
  } catch (error) {
    console.error("Redis DELETE error:", error.message);
  }
}

export function buildUserCacheKey(userId, ...parts) {
  return [CACHE_PREFIX, "user", userId, ...parts.map(String)].join(":");
}

export async function invalidateUserCache(userId) {
  if (!userId) return 0;

  try {
    const connected = await connectRedis();
    if (!connected) return 0;

    const pattern = buildUserCacheKey(userId, "*");
    const keys = [];

    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      keys.push(key);
    }

    if (!keys.length) return 0;

    const chunkSize = 200;
    for (let i = 0; i < keys.length; i += chunkSize) {
      const chunk = keys
        .slice(i, i + chunkSize)
        .map(String)
        .filter(Boolean);
      if (!chunk.length) continue;
      await redisClient.del(...chunk);
    }

    return keys.length;
  } catch (error) {
    console.error(`Redis invalidate error [${userId}]:`, error.message);
    return 0;
  }
}

export default redisClient;
