import { Redis } from "ioredis";

const UPSTASH_REDIS_REST_URL = "https://bright-maggot-86346.upstash.io";
const UPSTASH_REDIS_REST_TOKEN = "AYXAAIncDI4ZjI0NTUxNDUyOWY0NWE5YjdmNmY1MmE1OGU4ODIwY3AyODYzNDY";

const getRedisUrl = () => {
  return `redis://default:${UPSTASH_REDIS_REST_TOKEN}@${UPSTASH_REDIS_REST_URL.replace("https://", "").replace(":443", "")}`;
};

export const redis = new Redis(getRedisUrl());

export const saveSecret = async (id: string, text: string, password: string | null) => {
  const data = JSON.stringify({ text, password });
  await redis.setex(id, 86400, data);
};

export const getAndDeleteSecret = async (id: string, password: string | null) => {
  const data = await redis.get(id);
  if (!data) return null;

  const parsed = JSON.parse(data);
  
  if (parsed.password && parsed.password !== password) {
    return { needPassword: true };
  }

  await redis.del(id);
  return { text: parsed.text };
};
