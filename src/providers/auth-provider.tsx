"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  userService,
  type User,
  LS_DASHBOARD_NAV,
  LS_DASHBOARD_TENANT,
} from "@/services/UserService";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  /** Tras login exitoso: lee token/rol de localStorage y actualiza el contexto antes de navegar. */
  applySessionFromStorage: () => void;
  isAuthenticated: boolean;
  isSeller: boolean | undefined;
  isAdmin: boolean | undefined;
  isUser: boolean | undefined;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const initialCheckDone = useRef(false);
  const navigationSynced = useRef(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigationSynced.current = false;
      return;
    }
    if (navigationSynced.current) return;
    navigationSynced.current = true;
    void userService.refreshDashboardNavigation();
  }, [loading, user]);

  useEffect(() => {
    const onAuthRoute = pathname?.startsWith("/auth") ?? false;

    if (onAuthRoute) {
      // No borrar localStorage aquí: al iniciar sesión el token se guarda en esta misma ruta;
      // clearClientSession() provocaba condiciones de carrera y “cargando” infinito.
      setUser(null);
      setLoading(false);
      initialCheckDone.current = true;
      return;
    }

    let cancelled = false;

    if (!initialCheckDone.current) {
      setLoading(true);
    }

    const checkAuth = async () => {
      try {
        if (
          typeof window !== "undefined" &&
          (!userService.getToken() || !localStorage.getItem("user_role"))
        ) {
          if (!cancelled) {
            setUser(null);
          }
          return;
        }

        const isAuth = await userService.isAuthenticated();

        if (cancelled) return;

        if (isAuth) {
          setUser(userService.getCurrentUser());
        } else {
          setUser(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) {
          initialCheckDone.current = true;
        }
        setLoading(false);
      }
    };

    void checkAuth();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "access_token" ||
        e.key === "user_role" ||
        e.key === LS_DASHBOARD_NAV ||
        e.key === LS_DASHBOARD_TENANT
      ) {
        const isAuth = userService.isAuthenticatedSync();
        if (!isAuth) {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = useCallback(async () => {
    await userService.logout();
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  const applySessionFromStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!userService.getToken() || !localStorage.getItem("user_role")) {
      setUser(null);
      return;
    }
    navigationSynced.current = false;
    setUser(userService.getCurrentUser());
    setLoading(false);
    initialCheckDone.current = true;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      logout,
      applySessionFromStorage,
      isAuthenticated: !!user,
      isSeller: loading ? undefined : user?.role === "seller",
      isAdmin: loading ? undefined : user?.role === "admin",
      isUser: loading ? undefined : user?.role === "user",
    }),
    [user, loading, logout, applySessionFromStorage],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
