"use client";

import { useEffect, useState } from "react";
import { Building2, Loader2, Plus, Save, Shield, X, Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import {
  getDashboardNavSectionLabel,
  getDashboardNavSectionTitle,
} from "@/config/dashboard-navigation-registry";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon";
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles";
import { Label } from "@/components/ui/label";
import {
  createTenant,
  getTenant,
  updateTenant,
  type TenantAdminDto,
} from "@/services/TenantAdminService";
import {
  ADMIN_ROLE_NAV_IDS,
  DASHBOARD_NAV_SECTION_IDS,
  USER_ROLE_NAV_IDS,
  type DashboardNavSectionId,
} from "@/types/dashboard-navigation";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

type NavState = {
  user: string[];
  seller: string[];
  admin: string[];
  disabled: string[];
};

const EMPTY_NAV: NavState = {
  user: [],
  seller: [],
  admin: [],
  disabled: [],
};

/** Para tabla / resúmenes (mismo contrato que el JSON del API). */
export type TenantNavConfigParsed = NavState;

export function parseTenantNavigationConfig(
  raw: string | null | undefined,
): TenantNavConfigParsed {
  return parseNavConfig(raw ?? null);
}

/** Claves de rol / disabled que el API guarda en `navigation_config`. */
export const TENANT_NAV_JSON_KEYS = [
  "user",
  "seller",
  "admin",
  "disabled",
] as const;

export type TenantNavJsonKey = (typeof TENANT_NAV_JSON_KEYS)[number];

const FULL_NAV_KEYS = new Set<TenantNavJsonKey>(TENANT_NAV_JSON_KEYS);

/**
 * Claves realmente presentes en el JSON del tenant.
 * Si el objeto no tiene ninguna conocida (p. ej. `{}`), se asume plantilla completa.
 * Un tenant solo con `{"admin":[...]}` → solo `admin` (como en la BD por rol).
 */
export function navigationKeysPresentInTenantConfig(
  raw: string | null | undefined,
): Set<TenantNavJsonKey> {
  if (raw == null || !String(raw).trim()) return new Set(FULL_NAV_KEYS);
  try {
    const o = JSON.parse(String(raw)) as Record<string, unknown>;
    const present = new Set<TenantNavJsonKey>();
    for (const k of TENANT_NAV_JSON_KEYS) {
      if (Object.prototype.hasOwnProperty.call(o, k)) present.add(k);
    }
    return present.size > 0 ? present : new Set(FULL_NAV_KEYS);
  } catch {
    return new Set(FULL_NAV_KEYS);
  }
}

function buildNavigationJsonPartial(
  nav: NavState,
  keys: Set<TenantNavJsonKey>,
): string {
  const o: Record<string, string[]> = {};
  if (keys.has("user")) o.user = nav.user;
  if (keys.has("seller")) o.seller = nav.seller;
  if (keys.has("admin")) o.admin = nav.admin;
  if (keys.has("disabled")) o.disabled = nav.disabled;
  return JSON.stringify(o);
}

function parseNavConfig(raw: string | null): NavState {
  const empty: NavState = {
    user: [],
    seller: [],
    admin: [],
    disabled: [],
  };
  if (!raw?.trim()) return empty;
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const arr = (k: string) =>
      Array.isArray(o[k]) ? (o[k] as string[]).filter(Boolean) : [];
    return {
      user: arr("user"),
      seller: arr("seller"),
      admin: arr("admin"),
      disabled: arr("disabled"),
    };
  } catch {
    return empty;
  }
}

function toggleId(list: string[], id: string, on: boolean): string[] {
  if (on) {
    if (list.includes(id)) return list;
    return [...list, id];
  }
  return list.filter((x) => x !== id);
}

function moveAt(list: string[], index: number, dir: -1 | 1): string[] {
  const j = index + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[index], next[j]] = [next[j], next[index]];
  return next;
}

function RoleNavEditor({
  heading,
  ids,
  value,
  onChange,
  fieldKey,
}: {
  heading: string;
  ids: readonly DashboardNavSectionId[];
  value: string[];
  onChange: (next: string[]) => void;
  /** Evita colisiones de id entre instancias / tenants */
  fieldKey: string;
}) {
  return (
    <div className="rounded-lg border border-[#c3cad9] bg-white/80 p-3 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#303030]">
        {heading}
      </h3>
      <div className="grid gap-2">
        {ids.map((id) => {
          const checked = value.includes(id);
          return (
            <div key={id} className="flex items-center gap-2">
              <Checkbox
                id={`${fieldKey}-${id}`}
                checked={checked}
                onCheckedChange={(v) =>
                  onChange(toggleId(value, id, v === true))
                }
              />
              <Label
                htmlFor={`${fieldKey}-${id}`}
                className="cursor-pointer text-sm font-normal leading-snug text-[#303030]"
              >
                {getDashboardNavSectionTitle(id)}
              </Label>
            </div>
          );
        })}
      </div>
      {value.length > 0 ? (
        <div className="mt-3 border-t border-[#c3cad9]/60 pt-2">
          <p className="mb-1.5 text-sm font-medium uppercase text-[#303030]/70">
            Orden en el menú
          </p>
          <ul className="space-y-1">
            {value.map((id, idx) => (
              <li
                key={id}
                className="flex items-center gap-1.5 rounded-md bg-[#e8e8ec] px-2 py-1 text-sm text-[#303030]"
              >
                <span className="min-w-0 flex-1 truncate">
                  {getDashboardNavSectionLabel(id)}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 px-1.5 text-sm"
                  disabled={idx === 0}
                  onClick={() => onChange(moveAt(value, idx, -1))}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 px-1.5 text-sm"
                  disabled={idx === value.length - 1}
                  onClick={() => onChange(moveAt(value, idx, 1))}
                >
                  ↓
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function DisabledNavEditor({
  value,
  onChange,
  fieldKey,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  fieldKey: string;
}) {
  return (
    <div className="rounded-lg border border-amber-300/80 bg-amber-50/90 p-3 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold text-[#303030]">
        Secciones deshabilitadas
      </h3>
      <p className="mb-2 text-sm leading-snug text-[#303030]/80">
        No aparecen en el menú aunque el rol las incluya.
      </p>
      <div className="grid gap-2">
        {DASHBOARD_NAV_SECTION_IDS.map((id) => {
          const checked = value.includes(id);
          return (
            <div key={id} className="flex items-center gap-2">
              <Checkbox
                id={`${fieldKey}-dis-${id}`}
                checked={checked}
                onCheckedChange={(v) =>
                  onChange(toggleId(value, id, v === true))
                }
              />
              <Label
                htmlFor={`${fieldKey}-dis-${id}`}
                className="cursor-pointer text-sm font-normal leading-snug text-[#303030]"
              >
                {getDashboardNavSectionTitle(id)}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ModalChrome({
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-[min(100vw-1rem,480px)] flex-col bg-white shadow-2xl ${poppins.className}`}
      >
        <div className="flex items-start justify-between p-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight text-[#303030]">
              {title}
            </h2>
            <p className="text-sm text-[#303030]/90">{subtitle}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
          {children}
        </div>
        {footer ? (
          <div className="border-t border-gray-200 bg-white p-4">{footer}</div>
        ) : null}
      </div>
    </>
  );
}

const DEFAULT_CREATE_NAV_JSON = JSON.stringify({
  user: [],
  seller: [],
  admin: [],
  disabled: [],
});

export function TenantCreatePanel({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (tenantId: number) => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setName("");
    setSaving(false);
  }, [isOpen]);

  const resetAndClose = () => {
    setName("");
    onClose();
  };

  async function handleCreate() {
    const n = name.trim();
    if (!n) {
      toast.error("Escribe un nombre");
      return;
    }
    setSaving(true);
    const r = await createTenant({
      name: n,
      navigation_config: DEFAULT_CREATE_NAV_JSON,
    });
    setSaving(false);
    if (!r.ok) {
      toast.error(r.error ?? "No se pudo crear");
      return;
    }
    toast.success("Organización creada");
    const id = r.data?.id;
    resetAndClose();
    if (id != null) onCreated(id);
  }

  if (!isOpen) return null;

  return (
    <ModalChrome
      title="Nueva organización"
      subtitle="El menú por rol empieza vacío; puedes configurarlo al guardar en el siguiente paso."
      onClose={resetAndClose}
      footer={
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetAndClose}
            disabled={saving}
            className="flex-1 border-[#1868db] text-[#1868db] bg-[#f8f7fc] hover:bg-[#1868db] hover:text-white"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={() => void handleCreate()}
            disabled={saving || !name.trim()}
            className="flex-1 bg-[#1868db] text-white hover:bg-[#1458c4]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando…
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Crear
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pb-4">
        <InputWithIcon
          icon={Building2}
          label="Nombre"
          value={name}
          onChange={(v) => setName(v)}
          placeholder="Nombre de la organización"
          className={AUTH_INPUT_FIELD_CLASS}
          disabled={saving}
          autoFocus
        />
      </div>
    </ModalChrome>
  );
}

function formatTs(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return iso;
  }
}

function NavReadOnlySummary({
  nav,
  keys,
}: {
  nav: NavState;
  keys: Set<TenantNavJsonKey>;
}) {
  const block = (label: string, ids: string[]) => (
    <div className="border-b border-[#c3cad9] py-2 last:border-0">
      <p className="mb-1 text-sm font-semibold text-[#303030]">{label}</p>
      {ids.length === 0 ? (
        <p className="text-sm text-[#303030]/60">Ninguna</p>
      ) : (
        <ul className="list-inside list-disc space-y-0.5 text-sm text-[#303030]">
          {ids.map((id) => (
            <li key={id}>{getDashboardNavSectionTitle(id)}</li>
          ))}
        </ul>
      )}
    </div>
  );
  return (
    <div className="rounded-lg border border-[#c3cad9] bg-white/80 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Menu className="h-4 w-4 text-[#a99ee6]" />
        <span className="text-sm font-medium text-[#303030]">Menú (solo roles definidos)</span>
      </div>
      {keys.has("user") ? block("Usuario", nav.user) : null}
      {keys.has("seller") ? block("Vendedor", nav.seller) : null}
      {keys.has("admin") ? block("Administrador", nav.admin) : null}
      {keys.has("disabled")
        ? block("Deshabilitadas (globales)", nav.disabled)
        : null}
    </div>
  );
}

export function TenantViewModal({
  isOpen,
  tenantId,
  onClose,
}: {
  isOpen: boolean;
  tenantId: number | null;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<TenantAdminDto | null>(null);

  useEffect(() => {
    if (!isOpen || tenantId == null) {
      setDetail(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const reqId = tenantId;
    setDetail(null);
    setLoading(true);
    void getTenant(reqId).then((r) => {
      if (cancelled) return;
      setLoading(false);
      if (!r.ok || !r.data) {
        toast.error(r.error ?? "No se pudo cargar la organización");
        onClose();
        return;
      }
      if (r.data.id !== reqId) return;
      setDetail(r.data);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, tenantId, onClose]);

  if (!isOpen || tenantId == null) return null;

  const nav = detail ? parseNavConfig(detail.navigation_config) : null;
  const viewKeys = detail
    ? navigationKeysPresentInTenantConfig(detail.navigation_config)
    : FULL_NAV_KEYS;

  return (
    <ModalChrome
      title="Datos de la organización"
      subtitle={
        detail
          ? `Solo esta organización · id ${detail.id}`
          : "Cargando…"
      }
      onClose={onClose}
      footer={
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full border-[#1868db] text-[#1868db] bg-[#f8f7fc] hover:bg-[#1868db] hover:text-white"
        >
          Cerrar
        </Button>
      }
    >
      {loading || !detail ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1868db]" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-b border-[#c3cad9] py-2 px-2.5">
            <div className="mb-1 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#a99ee6]" />
              <span className="text-sm text-[#303030]">Nombre</span>
            </div>
            <p className="text-lg font-medium text-[#303030]">{detail.name}</p>
          </div>
          <div className="grid gap-2 text-sm text-[#303030]">
            <p>
              <span className="text-[#303030]/70">Creado:</span>{" "}
              {formatTs(detail.created_at)}
            </p>
            <p>
              <span className="text-[#303030]/70">Actualizado:</span>{" "}
              {formatTs(detail.updated_at)}
            </p>
          </div>
          {nav ? <NavReadOnlySummary nav={nav} keys={viewKeys} /> : null}
        </div>
      )}
    </ModalChrome>
  );
}

export function TenantEditModal({
  isOpen,
  tenantId,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  tenantId: number | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [nav, setNav] = useState<NavState>(EMPTY_NAV);
  /** Fecha del servidor solo del tenant que coincide con esta petición (evita datos cruzados). */
  const [serverUpdatedAt, setServerUpdatedAt] = useState<string | null>(null);
  /** Qué roles/editores mostrar: según claves del JSON cargado (p. ej. solo `admin`). */
  const [visibleNavKeys, setVisibleNavKeys] = useState<Set<TenantNavJsonKey> | null>(
    null,
  );

  const resetAndClose = () => {
    setName("");
    setNav(EMPTY_NAV);
    setServerUpdatedAt(null);
    setVisibleNavKeys(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen || tenantId == null) {
      setName("");
      setNav(EMPTY_NAV);
      setServerUpdatedAt(null);
      setVisibleNavKeys(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    const reqId = tenantId;
    setName("");
    setNav(EMPTY_NAV);
    setServerUpdatedAt(null);
    setVisibleNavKeys(null);
    setLoading(true);
    void getTenant(reqId).then((r) => {
      if (cancelled) return;
      setLoading(false);
      if (!r.ok || !r.data) {
        toast.error(r.error ?? "No se pudo cargar la organización");
        onClose();
        return;
      }
      if (r.data.id !== reqId) return;
      setName(r.data.name);
      setNav(parseNavConfig(r.data.navigation_config));
      setServerUpdatedAt(r.data.updated_at ?? null);
      setVisibleNavKeys(
        navigationKeysPresentInTenantConfig(r.data.navigation_config),
      );
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, tenantId, onClose]);

  if (!isOpen || tenantId == null) return null;

  const fk = `tenant-${tenantId}-edit`;

  async function handleSave() {
    if (tenantId == null) return;
    const id = tenantId;
    if (!visibleNavKeys?.size) {
      toast.error("No hay claves de menú para guardar");
      return;
    }
    setSaving(true);
    const r = await updateTenant(id, {
      name: name.trim(),
      navigation_config: buildNavigationJsonPartial(nav, visibleNavKeys),
    });
    setSaving(false);
    if (!r.ok) {
      toast.error(r.error ?? "Error al guardar");
      return;
    }
    toast.success("Cambios guardados");
    onSaved();
    resetAndClose();
  }

  const editSubtitle = loading
    ? "Cargando datos de esta organización (id "
        + tenantId
        + ")…"
    : serverUpdatedAt
      ? `Solo organización id ${tenantId} · última edición ${formatTs(serverUpdatedAt)}`
      : `Solo organización id ${tenantId}`;

  return (
    <ModalChrome
      title="Editar organización"
      subtitle={editSubtitle}
      onClose={resetAndClose}
      footer={
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={resetAndClose}
            disabled={saving}
            className="flex-1 border-[#1868db] text-[#1868db] bg-[#f8f7fc] hover:bg-[#1868db] hover:text-white"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={() => void handleSave()}
            disabled={saving || loading || !name.trim()}
            className="flex-1 bg-[#1868db] text-white hover:bg-[#1458c4]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1868db]" />
        </div>
      ) : (
        <div className="space-y-4 pb-4">
          <InputWithIcon
            icon={Building2}
            label="Nombre"
            value={name}
            onChange={(v) => setName(v)}
            className={AUTH_INPUT_FIELD_CLASS}
            disabled={saving || loading}
          />
          <div className="flex items-center gap-2 text-sm text-[#303030]/80">
            <Shield className="h-3.5 w-3.5 shrink-0 text-[#a99ee6]" />
            <span>Id interno: {tenantId}</span>
          </div>

          {visibleNavKeys?.has("user") ? (
            <RoleNavEditor
              heading="Rol usuario"
              ids={USER_ROLE_NAV_IDS}
              value={nav.user}
              onChange={(user) => setNav((n) => ({ ...n, user }))}
              fieldKey={`${fk}-user`}
            />
          ) : null}
          {visibleNavKeys?.has("seller") ? (
            <RoleNavEditor
              heading="Rol vendedor"
              ids={USER_ROLE_NAV_IDS}
              value={nav.seller}
              onChange={(seller) => setNav((n) => ({ ...n, seller }))}
              fieldKey={`${fk}-seller`}
            />
          ) : null}
          {visibleNavKeys?.has("admin") ? (
            <RoleNavEditor
              heading="Rol administrador"
              ids={ADMIN_ROLE_NAV_IDS}
              value={nav.admin}
              onChange={(admin) => setNav((n) => ({ ...n, admin }))}
              fieldKey={`${fk}-admin`}
            />
          ) : null}
          {visibleNavKeys?.has("disabled") ? (
            <DisabledNavEditor
              value={nav.disabled}
              onChange={(disabled) => setNav((n) => ({ ...n, disabled }))}
              fieldKey={fk}
            />
          ) : null}
        </div>
      )}
    </ModalChrome>
  );
}
