// src/services/orders.service.ts
const API = process.env.NEXT_PUBLIC_API_URL as string;

type Json = unknown;

async function requestJSON<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  if (!contentType.includes("application/json")) {
    const snippet = raw.slice(0, 200).replace(/\s+/g, " ");
    throw new Error(
      `Respuesta no JSON (status ${res.status}) desde ${typeof input === "string" ? input : (input as URL).toString()}. Body: ${snippet}`
    );
  }

  let data: Json;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch (e) {
    throw new Error(`JSON inválido (status ${res.status}): ${(e as Error).message}`);
  }

  if (!res.ok) {
    const msg = (data as any)?.message || `HTTP ${res.status}`;
    throw new Error(String(msg));
  }

  return data as T;
}

function authHeaders(token: string) {
  const value = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return {
    Authorization: value,
    "Content-Type": "application/json",
  };
}

export const createOrder = async (products: number[], token: string) => {
  return requestJSON(`${API}/orders`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ products }),
  });
};

export const getAllOrders = async (token: string) => {
  return requestJSON(`${API}/users/orders`, {
    method: "GET",
    headers: authHeaders(token),
  });
};
