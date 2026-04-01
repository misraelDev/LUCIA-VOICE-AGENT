import { API_BASE_URL } from "@/config/env";
import {
  parseApiProblemResponse,
  parseApiSuccessEnvelope,
} from "@/lib/api-problem";

const BASE = `${API_BASE_URL}/admin/tenants`;

export interface TenantAdminDto {
  id: number;
  name: string;
  navigation_config: string | null;
  created_at?: string;
  updated_at?: string;
}

function unwrapData<T>(body: unknown): T | null {
  if (!body || typeof body !== "object") return null;
  const rec = body as Record<string, unknown>;
  if ("data" in rec && rec.data !== undefined) {
    return rec.data as T;
  }
  return body as T;
}

async function authHeaders(): Promise<HeadersInit> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function listTenants(): Promise<{
  ok: boolean;
  data?: TenantAdminDto[];
  error?: string;
}> {
  try {
    const res = await fetch(BASE, { headers: await authHeaders() });
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const p = parseApiProblemResponse(body);
      return {
        ok: false,
        error: p?.detail ?? res.statusText,
      };
    }
    const data = unwrapData<TenantAdminDto[]>(body);
    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function getTenant(id: number): Promise<{
  ok: boolean;
  data?: TenantAdminDto;
  error?: string;
}> {
  try {
    const res = await fetch(`${BASE}/${id}`, { headers: await authHeaders() });
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const p = parseApiProblemResponse(body);
      return { ok: false, error: p?.detail ?? res.statusText };
    }
    const data = unwrapData<TenantAdminDto>(body);
    return data ? { ok: true, data } : { ok: false, error: "Sin datos" };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function updateTenant(
  id: number,
  payload: { name?: string; navigation_config: string | null },
): Promise<{ ok: boolean; data?: TenantAdminDto; error?: string }> {
  try {
    const res = await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const p = parseApiProblemResponse(body);
      return { ok: false, error: p?.detail ?? res.statusText };
    }
    parseApiSuccessEnvelope(body);
    const data = unwrapData<TenantAdminDto>(body);
    return data ? { ok: true, data } : { ok: false, error: "Sin datos" };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function deleteTenant(id: number): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const res = await fetch(`${BASE}/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    });
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const p = parseApiProblemResponse(body);
      return {
        ok: false,
        error: p?.detail ?? res.statusText,
      };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function createTenant(payload: {
  name: string;
  navigation_config?: string | null;
}): Promise<{ ok: boolean; data?: TenantAdminDto; error?: string }> {
  try {
    const res = await fetch(BASE, {
      method: "POST",
      headers: await authHeaders(),
      body: JSON.stringify(payload),
    });
    const body: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const p = parseApiProblemResponse(body);
      return { ok: false, error: p?.detail ?? res.statusText };
    }
    const data = unwrapData<TenantAdminDto>(body);
    return data ? { ok: true, data } : { ok: false, error: "Sin datos" };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
