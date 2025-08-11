// src/services/productsFetcher.service.ts
import { Product } from "@/interfaces/Product";

const API = process.env.NEXT_PUBLIC_API_URL as string;

type Json = unknown;
type MessageShape = { message?: string };
type UnknownRecord = Record<string, unknown>;

function hasMessage(data: unknown): data is MessageShape {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in (data as UnknownRecord) &&
    typeof (data as UnknownRecord).message === "string"
  );
}

function withNgrokBypass(href: string, baseHeaders: HeadersInit = {}): HeadersInit {
  const isNgrok = href.includes("ngrok");
  return isNgrok
    ? { ...baseHeaders, "ngrok-skip-browser-warning": "true" }
    : baseHeaders;
}

async function requestJSON<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const href = typeof input === "string" ? input : (input as URL).toString();

  const res = await fetch(input, {
    ...init,
    headers: withNgrokBypass(
      href,
      {
        Accept: "application/json",
        ...(init?.headers || {}),
      }
    ),
    cache: "no-store",
    // mode: "cors", // opcional
  });

  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  if (!contentType.includes("application/json")) {
    const snippet = raw.slice(0, 200).replace(/\s+/g, " ");
    throw new Error(
      `Respuesta no JSON (status ${res.status}) desde ${href}. Body: ${snippet}`
    );
  }

  let data: Json;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch (e) {
    throw new Error(`JSON inválido (status ${res.status}): ${(e as Error).message}`);
  }

  if (!res.ok) {
    const msg = hasMessage(data) ? data.message! : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export async function fetchProducts(): Promise<Product[]> {
  return requestJSON<Product[]>(`${API}/products`);
}

export async function fetchProductById(id: string): Promise<Product> {
  // 1) Intento directo a /products/:id
  try {
    return await requestJSON<Product>(`${API}/products/${id}`);
  } catch {
    // 2) Fallback: lista + filtro
    const all = await requestJSON<Product[]>(`${API}/products`);
    const found = all.find((p) => String(p.id) === String(id));
    if (!found) throw new Error(`Producto con ID ${id} no encontrado`);
    return found;
  }
}
