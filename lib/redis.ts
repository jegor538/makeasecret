// Альтернативный вариант - через Upstash REST API
const UPSTASH_REDIS_REST_URL = "https://bright-maggot-86346.upstash.io";
const UPSTASH_REDIS_REST_TOKEN = "AYXAAIncDI4ZjI0NTUxNDUyOWY0NWE5YjdmNmY1MmE1OGU4ODIwY3AyODYzNDY";

export const saveSecret = async (id: string, text: string, password: string | null) => {
  const data = JSON.stringify({ text, password });
  const url = `${UPSTASH_REDIS_REST_URL}/set/${id}?ex=86400`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: data,
  });
  
  if (!res.ok) {
    throw new Error(`Redis error: ${res.status}`);
  }
};

export const getAndDeleteSecret = async (id: string, password: string | null) => {
  const getUrl = `${UPSTASH_REDIS_REST_URL}/get/${id}`;
  
  const getRes = await fetch(getUrl, {
    headers: {
      'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
  
  if (!getRes.ok) {
    return null;
  }
  
  const data = await getRes.json();
  if (!data.result) return null;
  
  const parsed = JSON.parse(data.result);
  
  if (parsed.password && parsed.password !== password) {
    return { needPassword: true };
  }
  
  // Удаляем после прочтения
  const delUrl = `${UPSTASH_REDIS_REST_URL}/del/${id}`;
  await fetch(delUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
  
  return { text: parsed.text };
};
