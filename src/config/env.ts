const DEFAULT_API_BASE = "http://localhost:8080/api/v1";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE;

function defaultWsUrl(): string {
  try {
    const u = new URL(API_BASE_URL);
    return `${u.origin}/ws`;
  } catch {
    return "http://localhost:8080/ws";
  }
}

export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || defaultWsUrl();
