import { LoginRequest } from "@/lib/api";
import { API_BASE_URL as BASE_URL } from "@/config/env";
import {
  parseApiProblemResponse,
  parseApiSuccessEnvelope,
} from "@/lib/api-problem";
import {
  extractDashboardNavigationPayload,
  parseTenantBriefDto,
  type DashboardNavigationPayload,
  type TenantBriefDto,
} from "@/types/dashboard-navigation";

export type { DashboardNavigationPayload, TenantBriefDto } from "@/types/dashboard-navigation";

const API_BASE_URL = `${BASE_URL}/users`;

/** Menú del sidebar definido por tenant (API). */
export const LS_DASHBOARD_NAV = "dashboard_navigation";
export const LS_DASHBOARD_TENANT = "dashboard_tenant";

/** Disparado al persistir menú/tenant (login, GET /me/navigation, logout). */
export const DASHBOARD_NAV_CHANGED_EVENT = "lucia-dashboard-nav-changed";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  referral_code?: string;
  created_at?: string;
  email_confirmed?: boolean;
}

/** Alta desde admin: mismo cuerpo que {@link SignUpRequest} (POST /signup multipart). */
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  paternalSurname: string;
  maternalSurname?: string;
  phone: string;
  role: "user" | "seller" | "admin";
}

/** Registro público: coincide con POST /users/signup (multipart) del API REST */
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  paternalSurname: string;
  maternalSurname?: string;
  phone: string;
  role?: "USER" | "SELLER" | "ADMIN";
}

/** Éxito y error siguen ResponseDetail: `title` + `detail` desde el API. */
export interface SignUpResponse {
  success: boolean;
  title?: string;
  detail?: string;
}

// Constantes para roles
export const USER_ROLES = {
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface UserListMeta {
  current_page: number | null;
  per_page: number;
  total: number;
  last_page: number | null;
  next_cursor: string | null;
  prev_cursor: string | null;
}

export interface UserListResponse {
  data: User[];
  meta: UserListMeta;
}

export type GetUsersParams = {
  page?: number;
  per_page?: number;
  limit?: number;
  search?: string;
  role?: string;
  cursor?: string;
  cursor_before?: string;
};

export interface UserDetailResponse {
  id: string;
  email: string;
  role: string;
  created_at: string;
  email_confirmed: boolean;
  /** Organización (tenant). null = sin tenant asignado. */
  tenant_id?: number | null;
  tenant_name?: string | null;
}

function parseUserDetail(inner: Record<string, unknown>): UserDetailResponse | null {
  const email = inner.email;
  if (typeof email !== "string") return null;
  const idRaw = inner.id;
  const id =
    typeof idRaw === "string"
      ? idRaw
      : typeof idRaw === "number"
        ? String(idRaw)
        : null;
  if (!id) return null;
  const role = typeof inner.role === "string" ? inner.role : "";
  const created_at =
    typeof inner.created_at === "string" ? inner.created_at : "";
  const email_confirmed = inner.email_confirmed === true;

  let tenant_id: number | null = null;
  if ("tenant_id" in inner) {
    const tid = inner.tenant_id;
    if (tid === null) tenant_id = null;
    else if (typeof tid === "number" && Number.isFinite(tid)) tenant_id = tid;
    else if (typeof tid === "string" && tid.trim() !== "") {
      const n = Number(tid);
      tenant_id = Number.isFinite(n) ? n : null;
    }
  }

  const tenant_name =
    typeof inner.tenant_name === "string" ? inner.tenant_name : null;

  return {
    id,
    email,
    role,
    created_at,
    email_confirmed,
    tenant_id,
    tenant_name,
  };
}

export interface AuthResponse {
  success: boolean;
  /** Texto principal para toasts legados; preferir `title` + `detail` del API */
  message: string;
  title?: string;
  detail?: string;
  user?: User | null;
  error?: Error | null;
}

function extractErrorMessage(errorData: unknown, defaultMessage: string): string {
  return parseApiProblemResponse(errorData)?.detail ?? defaultMessage;
}

class UserService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const loginUrl = `${API_BASE_URL}/signin`;
    console.log("[UserService] Iniciando login...");
    console.log("[UserService] URL:", loginUrl);
    console.log("[UserService] Email:", credentials.email);

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log(
        "[UserService] Response status:",
        response.status,
        response.statusText,
      );

      if (!response.ok) {
        let errorMessage = (response.statusText || String(response.status)).trim();
        let problemTitle: string | undefined;
        try {
          const text = await response.text();
          if (text) {
            try {
              const errorData: unknown = JSON.parse(text);
              console.log("[UserService] Error response data:", errorData);
              const p = parseApiProblemResponse(errorData);
              if (p) {
                errorMessage = p.detail;
                problemTitle = p.title;
              } else {
                const extracted = extractErrorMessage(errorData, "");
                if (extracted) errorMessage = extracted;
              }
            } catch {
              const trimmed = text.trim();
              if (trimmed) errorMessage = trimmed;
            }
          }
        } catch {
          console.log("[UserService] No se pudo leer el cuerpo de error");
        }

        console.log("[UserService] Login fallido:", errorMessage);
        return {
          success: false,
          message: errorMessage,
          title: problemTitle,
          detail: errorMessage,
          user: null,
          error: new Error(errorMessage),
        };
      }

      const apiResponse = (await response.json()) as Record<string, unknown>;
      const envelope = parseApiSuccessEnvelope(apiResponse);
      const data = apiResponse.data as Record<string, unknown> | undefined;

      console.log("[UserService] Login exitoso, respuesta:", {
        hasAccessToken: !!(data && data.access_token),
        role: data?.role,
      });

      const accessToken =
        data && typeof data.access_token === "string"
          ? data.access_token
          : typeof apiResponse.access_token === "string"
            ? apiResponse.access_token
            : undefined;
      const roleRaw =
        data && typeof data.role === "string"
          ? data.role
          : typeof apiResponse.role === "string"
            ? apiResponse.role
            : undefined;

      if (accessToken) {
        localStorage.setItem("access_token", accessToken);
        console.log("[UserService] Token guardado en localStorage");
      } else {
        console.warn(
          "[UserService] No se recibió access_token en la respuesta",
        );
      }

      if (roleRaw) {
        const normalizedRole = roleRaw.toLowerCase();
        localStorage.setItem("user_role", normalizedRole);
        console.log("[UserService] Rol guardado:", normalizedRole);
      } else {
        console.warn("[UserService] No se recibió role en la respuesta");
      }

      if (data !== undefined && data !== null && typeof data === "object" && !Array.isArray(data)) {
        const navPayload = extractDashboardNavigationPayload(data);
        if (navPayload !== null) {
          this.persistNavigationFromAuthData(navPayload);
        } else {
          this.persistNavigationFromAuthData(null);
        }
      } else {
        this.persistNavigationFromAuthData(null);
      }

      const detailText =
        envelope.detail ??
        (typeof apiResponse.detail === "string" ? apiResponse.detail : "");
      const titleText =
        envelope.title ??
        (typeof apiResponse.title === "string" ? apiResponse.title : "");

      return {
        success: true,
        message: detailText || titleText,
        title: titleText || undefined,
        detail: detailText || undefined,
        user: null,
        error: null,
      };
    } catch (error) {
      console.error("[UserService] Error de conexión:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      return {
        success: false,
        message: errorMessage,
        detail: errorMessage,
        user: null,
        error: error instanceof Error ? error : new Error(errorMessage),
      };
    }
  }

  async signUp(request: SignUpRequest): Promise<SignUpResponse> {
    const formData = new FormData();
    formData.append("email", request.email.trim());
    formData.append("password", request.password);
    formData.append("name", request.name.trim());
    formData.append("paternalSurname", request.paternalSurname.trim());
    formData.append("maternalSurname", (request.maternalSurname ?? "").trim());
    formData.append("phone", request.phone.trim());
    formData.append("role", request.role ?? "USER");

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const statusLine = (response.statusText || String(response.status)).trim();
        try {
          const text = await response.text();
          if (text) {
            try {
              const errorData: unknown = JSON.parse(text);
              const p = parseApiProblemResponse(errorData);
              if (p) {
                return {
                  success: false,
                  title: p.title,
                  detail: p.detail,
                };
              }
              const extracted = extractErrorMessage(errorData, "");
              return {
                success: false,
                detail: extracted || text.trim() || statusLine,
              };
            } catch {
              return {
                success: false,
                detail: text.trim() || statusLine,
              };
            }
          }
        } catch {
          /* ignore */
        }
        return { success: false, detail: statusLine };
      }

      try {
        const body: unknown = await response.json();
        const env = parseApiSuccessEnvelope(body);
        return {
          success: true,
          title: env.title,
          detail: env.detail,
        };
      } catch {
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        detail: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // Error silencioso durante logout
    } finally {
      // Limpiar solo access_token y user_role
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      this.clearNavigationStorage();
      // Borrar cookie de autenticación
      try {
        document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Lax";
      } catch {}
    }
  }

  // Método para obtener el usuario actual desde el localStorage
  getCurrentUser(): User | null {
    try {
      const token = localStorage.getItem("access_token");
      const userRole = localStorage.getItem("user_role");

      // Si hay token y rol, retornar usuario
      if (token && userRole) {
        // Intentar extraer email del token JWT
        let userEmail = "";
        let userId = "";
        try {
          const tokenParts = token.split(".");
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            userEmail = payload.sub || payload.email || "";
            userId = payload.sub || payload.user_id || payload.id || userEmail;
          }
        } catch {
          // Si no se puede decodificar, usar valores por defecto
        }

        const user: User = {
          id: userId || "unknown",
          email: userEmail || "unknown@example.com",
          role: userRole,
        };
        return user;
      }

      return null;
    } catch {
      return null;
    }
  }

  // Método para verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    const token = this.getToken();
    const userRole = localStorage.getItem("user_role");

    if (!token || !userRole) {
      return false;
    }

    // Verificar que el token no haya expirado (si es un JWT válido)
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        console.warn("isAuthenticated: Token no tiene formato JWT válido");
        // Si hay token y rol, considerar autenticado aunque el formato no sea JWT estándar
        return true;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp && payload.exp <= currentTime) {
        // Token expirado, limpiar datos
        console.warn("isAuthenticated: Token expirado", {
          exp: payload.exp,
          currentTime,
        });
        this.clearExpiredAuthData();
        return false;
      }

      return true;
    } catch (error) {
      console.error("isAuthenticated: Error al decodificar token", error);
      // Si no es un JWT válido pero hay token y rol, considerar autenticado
      // Esto permite que funcione incluso si el formato del token no es estándar
      return true;
    }
  }

  // Método síncrono para verificación rápida (sin refresh)
  isAuthenticatedSync(): boolean {
    const token = this.getToken();
    const userRole = localStorage.getItem("user_role");

    if (!token || !userRole) {
      return false;
    }

    try {
      const tokenParts = token.split(".");
      if (tokenParts.length !== 3) {
        // Si hay token y rol, considerar autenticado aunque el formato no sea JWT estándar
        return true;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;

      // Si el token tiene exp, verificar que no haya expirado
      if (payload.exp) {
        return payload.exp > currentTime;
      }

      // Si no tiene exp, considerar válido si hay token y rol
      return true;
    } catch (error) {
      console.error("isAuthenticatedSync: Error al decodificar token", error);
      // Si no es un JWT válido pero hay token y rol, considerar autenticado
      return true;
    }
  }

  // Método para limpiar datos de autenticación expirados
  private clearExpiredAuthData(): void {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
      this.clearNavigationStorage();

      // Borrar cookie de autenticación
      try {
        document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Lax";
      } catch {}
    } catch {
      // Error silencioso al limpiar datos
    }
  }

  private notifyNavigationChanged(): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(DASHBOARD_NAV_CHANGED_EVENT));
  }

  /**
   * Persiste menú/tenant del login o GET /users/me/navigation (mismo contrato que el API).
   */
  persistNavigationFromAuthData(payload: DashboardNavigationPayload | null): void {
    if (typeof window === "undefined") return;
    if (payload === null) {
      localStorage.removeItem(LS_DASHBOARD_NAV);
      localStorage.removeItem(LS_DASHBOARD_TENANT);
      this.notifyNavigationChanged();
      return;
    }
    localStorage.setItem(LS_DASHBOARD_NAV, JSON.stringify(payload.navigation));
    if (payload.tenant !== null) {
      localStorage.setItem(LS_DASHBOARD_TENANT, JSON.stringify(payload.tenant));
    } else {
      localStorage.removeItem(LS_DASHBOARD_TENANT);
    }
    this.notifyNavigationChanged();
  }

  getStoredNavigationKeys(): string[] | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(LS_DASHBOARD_NAV);
    if (raw == null) return null;
    try {
      const v: unknown = JSON.parse(raw);
      if (!Array.isArray(v)) return null;
      return v.filter((x): x is string => typeof x === "string");
    } catch {
      return null;
    }
  }

  /** Tenant guardado tras login/sync (misma forma que {@link TenantBriefDto}). */
  getStoredTenantBrief(): TenantBriefDto | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(LS_DASHBOARD_TENANT);
    if (raw == null) return null;
    try {
      return parseTenantBriefDto(JSON.parse(raw) as unknown);
    } catch {
      return null;
    }
  }

  clearNavigationStorage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LS_DASHBOARD_NAV);
    localStorage.removeItem(LS_DASHBOARD_TENANT);
    this.notifyNavigationChanged();
  }

  /** Sincroniza menú con el tenant actual (tras cambios en servidor o sesión antigua). */
  async refreshDashboardNavigation(): Promise<void> {
    const token = this.getToken();
    if (!token || typeof window === "undefined") return;
    try {
      const response = await fetch(`${API_BASE_URL}/me/navigation`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) return;
      const body: unknown = await response.json();
      const rec =
        body && typeof body === "object" && body !== null && "data" in body
          ? (body as { data: unknown }).data
          : body;
      const navPayload = extractDashboardNavigationPayload(rec);
      if (navPayload !== null) {
        this.persistNavigationFromAuthData(navPayload);
      }
    } catch {
      /* ignore */
    }
  }

  getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  getRefreshToken(): string | null {
    // El backend no devuelve refresh_token, siempre retornar null
    return null;
  }

  // Método adicional para refresh token (no disponible en el backend actual)
  async refreshToken(): Promise<boolean> {
    // El backend no soporta refresh token, siempre retornar false
    return false;
  }

  // Métodos de administración de usuarios (solo para admin)
  async createUser(
    userData: CreateUserRequest,
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: "No hay token de autenticación" };
      }

      const formData = new FormData();
      formData.append("email", userData.email.trim());
      formData.append("password", userData.password);
      formData.append("name", userData.name.trim());
      formData.append("paternalSurname", userData.paternalSurname.trim());
      formData.append(
        "maternalSurname",
        (userData.maternalSurname ?? "").trim(),
      );
      formData.append("phone", userData.phone.trim());
      formData.append("role", userData.role.toUpperCase());

      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const defaultError = `Error ${response.status}: ${response.statusText}`;
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: extractErrorMessage(errorData, defaultError),
        };
      }

      const data = await response.json().catch(() => ({}));
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  async deleteUser(
    id: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: "No hay token de autenticación" };
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const defaultError = `Error ${response.status}: ${response.statusText}`;
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: extractErrorMessage(errorData, defaultError),
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  async getAllUsers(params?: GetUsersParams): Promise<{
    success: boolean;
    data?: UserListResponse;
    error?: string;
  }> {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: "No hay token de autenticación" };
      }

      const q = new URLSearchParams();
      if (params?.page != null) q.set("page", String(params.page));
      if (params?.per_page != null) q.set("per_page", String(params.per_page));
      if (params?.limit != null) q.set("limit", String(params.limit));
      if (params?.search?.trim()) q.set("search", params.search.trim());
      if (params?.role?.trim()) q.set("role", params.role.trim());
      if (params?.cursor) q.set("cursor", params.cursor);
      if (params?.cursor_before) q.set("cursor_before", params.cursor_before);

      const qs = q.toString();
      const url = qs ? `${API_BASE_URL}?${qs}` : `${API_BASE_URL}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const defaultError = `Error ${response.status}: ${response.statusText}`;
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: extractErrorMessage(errorData, defaultError),
        };
      }

      const apiResponse = (await response.json()) as Record<string, unknown>;
      const inner = apiResponse.data;
      if (!inner || typeof inner !== "object" || Array.isArray(inner)) {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      const payload = inner as Record<string, unknown>;
      if (!Array.isArray(payload.data)) {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      const rawMeta = payload.meta;
      if (!rawMeta || typeof rawMeta !== "object" || Array.isArray(rawMeta)) {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      const meta = rawMeta as UserListMeta;
      if (typeof meta.per_page !== "number" || typeof meta.total !== "number") {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      const normalizedMeta: UserListMeta = {
        ...meta,
        last_page:
          typeof meta.last_page === "number" ? meta.last_page : 1,
        current_page:
          meta.current_page === null || meta.current_page === undefined
            ? null
            : meta.current_page,
      };
      return {
        success: true,
        data: { data: payload.data as User[], meta: normalizedMeta },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  async getUserById(
    id: string,
  ): Promise<{ success: boolean; data?: UserDetailResponse; error?: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: "No hay token de autenticación" };
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const defaultError = `Error ${response.status}: ${response.statusText}`;
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: extractErrorMessage(errorData, defaultError),
        };
      }

      const apiResponse = (await response.json()) as Record<string, unknown>;
      const inner = apiResponse.data;
      if (!inner || typeof inner !== "object" || Array.isArray(inner)) {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      if (typeof inner !== "object" || inner === null) {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      const detail = parseUserDetail(inner as Record<string, unknown>);
      if (!detail) {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      return { success: true, data: detail };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  /** Asigna o quita la organización del usuario (solo admin). {@code null} = sin tenant. */
  async patchUserTenant(
    id: string,
    tenantId: number | null,
  ): Promise<{ success: boolean; data?: UserDetailResponse; error?: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        return { success: false, error: "No hay token de autenticación" };
      }

      const response = await fetch(`${API_BASE_URL}/${id}/tenant`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tenant_id: tenantId }),
      });

      if (!response.ok) {
        const defaultError = `Error ${response.status}: ${response.statusText}`;
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: extractErrorMessage(errorData, defaultError),
        };
      }

      const apiResponse = (await response.json()) as Record<string, unknown>;
      const inner = apiResponse.data;
      if (!inner || typeof inner !== "object" || Array.isArray(inner)) {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      const detail = parseUserDetail(inner as Record<string, unknown>);
      if (!detail) {
        return { success: false, error: "Respuesta inválida del servidor" };
      }
      return { success: true, data: detail };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de conexión",
      };
    }
  }

  // Verificar si el usuario actual es admin
  isAdmin(): boolean {
    const userRole = localStorage.getItem("user_role");
    return userRole === "admin";
  }
}

// WebSocket functions using the existing WebSocketService
import {
  webSocketService,
  type WebSocketMessage,
  type UserData,
} from "./WebSocketService";

// Función para suscribirse a eventos de WebSocket de usuarios
export function subscribeToUserEvents(
  eventType: "userCreated" | "usersConsulted" | "userConsulted",
  callback: (data: UserData | UserData[]) => void,
): () => void {
  // Conectar WebSocket si no está conectado
  webSocketService.connect();

  // Mapear tipos de eventos a topics
  const topicMap = {
    userCreated: "/topic/users/new",
    usersConsulted: "/topic/users/consulted",
    userConsulted: "/topic/user/consulted",
  };

  const topic = topicMap[eventType];

  // Suscribirse al topic
  webSocketService.subscribe(topic, (message: WebSocketMessage) => {
    if (message.data) {
      callback(message.data as UserData | UserData[]);
    }
  });

  // Retornar función para desuscribirse
  return () => {
    webSocketService.unsubscribe(topic);
  };
}

// Función para desconectar WebSocket
export function disconnectUserWebSocket(): void {
  webSocketService.disconnect();
}

export const userService = new UserService();
