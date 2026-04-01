"use client";

import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { Building2, Loader2, Mail, Save, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon";
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles";
import { toast } from "sonner";
import { userService, type UserDetailResponse } from "@/services/UserService";
import { listTenants, type TenantAdminDto } from "@/services/TenantAdminService";
import { formatRoleToSpanish } from "@/lib/format";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const NO_TENANT = "__none__";

export function EditUserPanel({
  isOpen,
  userId,
  onClose,
  onSaved,
}: {
  isOpen: boolean;
  userId: string | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserDetailResponse | null>(null);
  const [tenants, setTenants] = useState<TenantAdminDto[]>([]);
  const [tenantChoice, setTenantChoice] = useState(NO_TENANT);

  useEffect(() => {
    if (!isOpen) return;
    void listTenants().then((r) => {
      if (r.ok && r.data) setTenants(r.data);
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || userId == null || userId === "") {
      setUser(null);
      setTenantChoice(NO_TENANT);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setUser(null);
    setTenantChoice(NO_TENANT);
    setLoading(true);
    void userService.getUserById(userId).then((r) => {
      if (cancelled) return;
      setLoading(false);
      if (!r.success || !r.data) {
        toast.error(r.error ?? "No se pudo cargar el usuario");
        onClose();
        return;
      }
      setUser(r.data);
      if (r.data.tenant_id != null && Number.isFinite(r.data.tenant_id)) {
        setTenantChoice(String(r.data.tenant_id));
      } else {
        setTenantChoice(NO_TENANT);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, userId, onClose]);

  const handleClose = () => {
    setUser(null);
    setTenantChoice(NO_TENANT);
    onClose();
  };

  async function saveTenant() {
    if (!user) return;
    const tid = tenantChoice === NO_TENANT ? null : Number(tenantChoice);
    if (tid !== null && !Number.isFinite(tid)) {
      toast.error("Organización no válida");
      return;
    }
    setSaving(true);
    const r = await userService.patchUserTenant(user.id, tid);
    setSaving(false);
    if (!r.success || !r.data) {
      toast.error(r.error ?? "Error al guardar");
      return;
    }
    setUser(r.data);
    toast.success("Organización actualizada");
    onSaved();
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-[min(100vw-1rem,440px)] flex-col bg-white shadow-2xl ${poppins.className}`}
      >
        <div className="flex items-start justify-between p-4">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#303030]">
              Editar usuario
            </h2>
            <p className="text-sm text-[#303030]/90">
              {loading
                ? "Cargando datos del usuario…"
                : "Email y rol son solo lectura. Elige la organización y guarda."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4">
          {loading || !user ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1868db]" />
            </div>
          ) : (
            <div className="space-y-4">
              <InputWithIcon
                icon={Mail}
                label="Email"
                readOnly
                tabIndex={-1}
                value={user.email}
                className={AUTH_INPUT_FIELD_CLASS}
                aria-readonly
              />
              <InputWithIcon
                icon={Shield}
                label="Rol"
                readOnly
                tabIndex={-1}
                value={formatRoleToSpanish(user.role)}
                className={AUTH_INPUT_FIELD_CLASS}
                aria-readonly
              />
              <InputWithIcon
                icon={Building2}
                label="Organización"
                options={[
                  { value: NO_TENANT, label: "Sin organización" },
                  ...tenants.map((t) => ({
                    value: String(t.id),
                    label: t.name,
                  })),
                ]}
                value={tenantChoice}
                onChange={(v) => setTenantChoice(v)}
                disabled={saving}
                className={AUTH_INPUT_FIELD_CLASS}
              />
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
              className="flex-1 border-[#1868db] bg-[#f8f7fc] text-[#1868db] shadow-[0px_1px_3px_rgba(166,_175,_195,_0.4)] transition-all duration-200 hover:bg-[#1868db] hover:text-white"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => void saveTenant()}
              disabled={saving || loading || !user}
              className="flex-1 bg-[#1868db] text-white transition-all duration-200 hover:bg-[#1458c4]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar organización
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
