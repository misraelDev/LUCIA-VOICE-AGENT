"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { z } from "zod";
import { PageHeaderActions } from "@/components/page-header";
import { TenantsTableSkeleton } from "@/components/data-table-skeleton";
import { DataTable } from "@/components/data-table";
import {
  navigationKeysPresentInTenantConfig,
  parseTenantNavigationConfig,
  TenantCreatePanel,
  TenantEditModal,
  TenantViewModal,
  type TenantNavJsonKey,
} from "@/components/tenant-admin-modals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteTenant, listTenants, type TenantAdminDto } from "@/services/TenantAdminService";
import { toast } from "sonner";
import { IconPlus } from "@tabler/icons-react";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

const tenantRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  navigation_config: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

type TenantRow = z.infer<typeof tenantRowSchema>;

function TenantMenuBadges({
  navigationConfig,
}: {
  navigationConfig: string | null | undefined;
}) {
  const n = parseTenantNavigationConfig(navigationConfig);
  const keys = navigationKeysPresentInTenantConfig(navigationConfig);
  const chips: {
    navKey: TenantNavJsonKey;
    label: string;
    count: number;
    className: string;
  }[] = [];
  const pushIf = (
    navKey: TenantNavJsonKey,
    label: string,
    count: number,
    className: string,
  ) => {
    if (keys.has(navKey))
      chips.push({ navKey, label, count, className });
  };
  pushIf(
    "user",
    "Usuario",
    n.user.length,
    "border-blue-200 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  );
  pushIf(
    "seller",
    "Vendedor",
    n.seller.length,
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
  );
  pushIf(
    "admin",
    "Admin",
    n.admin.length,
    "border-violet-200 bg-violet-50 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  );
  pushIf(
    "disabled",
    "Desh.",
    n.disabled.length,
    "border-amber-300 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100",
  );
  return (
    <div className="flex max-w-[280px] flex-wrap gap-1">
      {chips.length === 0 ? (
        <Badge
          variant="outline"
          className="text-sm font-normal text-muted-foreground"
        >
          Sin claves de menú
        </Badge>
      ) : (
        chips.map((c) => (
          <Badge
            key={c.navKey}
            variant="outline"
            title={`${c.label}: ${c.count} sección(es)`}
            className={`text-sm font-medium ${c.className}`}
          >
            {c.label} · {c.count}
          </Badge>
        ))
      )}
    </div>
  );
}

export default function AdminTenantsPage() {
  const [rows, setRows] = useState<TenantAdminDto[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewTenantId, setViewTenantId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editTenantId, setEditTenantId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [tenantPendingDelete, setTenantPendingDelete] =
    useState<TenantAdminDto | null>(null);
  const [tenantDeleteSubmitting, setTenantDeleteSubmitting] = useState(false);

  const loadList = useCallback(async () => {
    setLoadingList(true);
    const r = await listTenants();
    setLoadingList(false);
    if (!r.ok) {
      toast.error(r.error ?? "No se pudo cargar tenants");
      return;
    }
    setRows(r.data ?? []);
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const closeView = useCallback(() => {
    setViewOpen(false);
    setViewTenantId(null);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditTenantId(null);
  }, []);

  const openView = useCallback((t: TenantAdminDto) => {
    setViewTenantId(t.id);
    setViewOpen(true);
  }, []);

  const openEdit = useCallback((t: TenantAdminDto) => {
    setEditTenantId(t.id);
    setEditOpen(true);
  }, []);

  const requestTenantDelete = useCallback((t: TenantAdminDto) => {
    setTenantPendingDelete(t);
  }, []);

  const confirmTenantDelete = useCallback(async () => {
    if (!tenantPendingDelete) return;
    setTenantDeleteSubmitting(true);
    try {
      const t = tenantPendingDelete;
      const r = await deleteTenant(t.id);
      if (!r.ok) {
        toast.error(r.error ?? "No se pudo eliminar");
        return;
      }
      toast.success("Organización eliminada");
      setTenantPendingDelete(null);
      if (viewTenantId === t.id) {
        setViewOpen(false);
        setViewTenantId(null);
      }
      if (editTenantId === t.id) {
        setEditOpen(false);
        setEditTenantId(null);
      }
      void loadList();
    } finally {
      setTenantDeleteSubmitting(false);
    }
  }, [tenantPendingDelete, viewTenantId, editTenantId, loadList]);

  const closeCreate = useCallback(() => {
    setCreateOpen(false);
  }, []);

  const onTenantCreated = useCallback(
    (id: number) => {
      void loadList();
      setEditTenantId(id);
      setEditOpen(true);
    },
    [loadList],
  );

  const tableData: TenantRow[] = useMemo(
    () =>
      rows.map((t) => ({
        id: t.id,
        name: t.name,
        navigation_config: t.navigation_config,
        created_at: t.created_at,
        updated_at: t.updated_at,
      })),
    [rows],
  );

  const columns = useMemo<ColumnDef<TenantRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Organización",
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-gray-900">{row.original.name}</span>
            <span className="text-sm text-gray-400">id {row.original.id}</span>
          </div>
        ),
      },
      {
        id: "menu_by_role",
        header: "Menú por rol",
        cell: ({ row }) => (
          <TenantMenuBadges navigationConfig={row.original.navigation_config} />
        ),
      },
      {
        accessorKey: "created_at",
        header: "Creación",
        cell: ({ row }) => {
          const c = row.original.created_at;
          if (!c)
            return <span className="text-sm text-gray-400">—</span>;
          try {
            return (
              <span className="text-sm text-gray-600">
                {format(parseISO(c), "dd/MM/yyyy HH:mm", { locale: es })}
              </span>
            );
          } catch {
            return <span className="text-sm">{c}</span>;
          }
        },
      },
      {
        accessorKey: "updated_at",
        header: "Última actualización",
        cell: ({ row }) => {
          const u = row.original.updated_at;
          if (!u)
            return <span className="text-sm text-gray-400">—</span>;
          try {
            return (
              <span className="text-sm text-gray-600">
                {format(parseISO(u), "dd/MM/yyyy HH:mm", { locale: es })}
              </span>
            );
          } catch {
            return <span className="text-sm">{u}</span>;
          }
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const t = rows.find((x) => x.id === row.original.id);
          if (!t) return null;
          return (
            <DataTableRowActions
              onView={() => openView(t)}
              onEdit={() => openEdit(t)}
              onDelete={() => requestTenantDelete(t)}
            />
          );
        },
      },
    ],
    [rows, openView, openEdit, requestTenantDelete],
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeaderActions>
        <Button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2"
        >
          <IconPlus className="size-4 shrink-0" />
          Crear tenant
        </Button>
      </PageHeaderActions>

      {loadingList ? (
        <TenantsTableSkeleton rowCount={10} />
      ) : (
        <DataTable<TenantRow, typeof tenantRowSchema>
          data={tableData}
          columns={columns}
          schema={tenantRowSchema}
          enablePagination
          pageSize={10}
        />
      )}

      <TenantCreatePanel
        isOpen={createOpen}
        onClose={closeCreate}
        onCreated={onTenantCreated}
      />
      {viewTenantId != null ? (
        <TenantViewModal
          key={viewTenantId}
          isOpen={viewOpen}
          tenantId={viewTenantId}
          onClose={closeView}
        />
      ) : null}
      {editTenantId != null ? (
        <TenantEditModal
          key={editTenantId}
          isOpen={editOpen}
          tenantId={editTenantId}
          onClose={closeEdit}
          onSaved={() => void loadList()}
        />
      ) : null}

      <ConfirmDeleteDialog
        open={tenantPendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setTenantPendingDelete(null);
        }}
        title="Eliminar organización"
        description={
          <>
            ¿Eliminar{" "}
            <span className="font-medium text-foreground">
              {tenantPendingDelete?.name ?? "esta organización"}
            </span>
            {tenantPendingDelete != null ? (
              <> (id {tenantPendingDelete.id})</>
            ) : null}
            ? Los usuarios asignados quedarán sin organización. Esta acción no se
            puede deshacer.
          </>
        }
        onConfirm={confirmTenantDelete}
        submitting={tenantDeleteSubmitting}
      />
    </div>
  );
}
