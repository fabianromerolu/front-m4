// src/services/auth.service.ts
import { RegisterFormValues } from "@/validators/registerSchema";
// Si también tienes un login schema:
import { LoginFormVlaues } from "@/validators/loginSchema";

const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

export interface SimpleApiMessage {
  message?: string;
}

type Json = unknown;

async function parseJson(res: Response): Promise<Json> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export async function RegisterUser(userData: RegisterFormValues): Promise<Json> {
  const res = await fetch(`${apiUrl}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const body = await parseJson(res);
    throw new Error((body as SimpleApiMessage).message || "Registro fallido");
  }

  return parseJson(res);
}

export async function LoginUser(userData: LoginFormVlaues): Promise<AuthResponse> {
  const res = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const body = await parseJson(res);
    throw new Error((body as SimpleApiMessage).message || "Login fallido");
  }

  // Si tu backend no devuelve exactamente AuthResponse, ajusta este tipo.
  return (await parseJson(res)) as AuthResponse;
}
