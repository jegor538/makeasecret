import { Redis } from "ioredis";

const UPSTASH_REDIS_REST_URL = "https://bright-maggot-86346.upstash.io";
const UPSTASH_REDIS_REST_TOKEN = "AYXAAIncDI4ZjI0NTUxNDUyOWY0NWE5YjdmNmY1MmE1OGU4ODIwY3AyODYzNDY";

// Правильное подключение к Upstash Redis через REST
const redis = new Redis({
  host: "bright-maggot-86346.upstash.io",
  port: 6379,
  password: UPSTASH_REDIS_REST_TOKEN,
  tls: {},
  connectTimeout: 10000,
  retryStrategy: (times) => {
    if (times > 3) return null;
    return Math.min(times * 100, 3000);
  }
});

export const saveSecret = async (id: string, text: string, password: string | null) => {
  const data = JSON.stringify({ text, password });
  await redis.setex(id, 86400, data);
  console.log("Saved secret:", id);
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
