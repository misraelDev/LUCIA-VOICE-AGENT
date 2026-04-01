"use client";

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/** Pulso gris neutro: todo el bloque de carga usa esto (sin accent del tema). */
export function SkeletonBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-md bg-gray-200 animate-pulse dark:bg-gray-600",
        className,
      )}
    />
  );
}

export type DataTableSkeletonColumn = {
  /** Ancho de columna en tabla fija (`w-[28%]`, etc.) */
  widthClass: string;
  /** Ancho de la barra del encabezado (`max-w-[7rem]`, `w-20`, …) */
  headerBarClass: string;
  /** Solo lectores de pantalla (no hay texto visible en el skeleton). */
  ariaLabel: string;
  renderCell: () => ReactNode;
};

/** Paginación 100 % skeleton: sin texto ni iconos reales. */
function SkeletonPaginationFooter() {
  return (
    <div
      className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between"
      aria-busy
      aria-label="Cargando paginación"
    >
      <span className="sr-only">Cargando controles de paginación</span>
      <SkeletonBar className="h-4 w-32 shrink-0" />
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <SkeletonBar className="h-4 w-40 max-w-[40%]" />
        <SkeletonBar className="h-4 w-28" />
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBar key={i} className="h-9 w-9 shrink-0 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}

export type DataTableSkeletonProps = {
  columns: DataTableSkeletonColumn[];
  rowCount?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  className?: string;
};

/**
 * Mismo contenedor que {@link DataTable}: Card + tabla fija.
 * Buscador, cabeceras, celdas y pie son solo barras grises (misma apariencia en todas las tablas).
 */
export function DataTableSkeleton({
  columns,
  rowCount = 7,
  showSearch = true,
  showPagination = true,
  className,
}: DataTableSkeletonProps) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <Card className="w-full border-gray-300 shadow-sm">
        <CardContent className="space-y-3 px-4 py-3">
          {showSearch ? (
            <div
              className="w-full md:max-w-md"
              aria-busy
              aria-label="Cargando buscador"
            >
              <span className="sr-only">Cargando campo de búsqueda</span>
              <SkeletonBar className="h-10 w-full rounded-md" />
            </div>
          ) : null}

          <div className="relative min-h-0 w-full min-w-0 max-w-full">
            <div className="h-[31rem] w-full min-w-0 overflow-x-auto overflow-y-auto overscroll-contain">
              <Table
                containerClassName="overflow-visible"
                className="table-fixed min-w-[42rem] w-full"
              >
                <TableHeader className="sticky top-0 z-10 border-0 bg-white shadow-[0_1px_0_0_rgb(203_213_225)]">
                  <TableRow className="border-gray-300 hover:bg-transparent">
                    {columns.map((col, hi) => (
                      <TableHead
                        key={`h-${hi}-${col.ariaLabel}`}
                        className={cn(
                          "h-12 px-3 text-left align-middle",
                          col.widthClass,
                        )}
                      >
                        <span className="sr-only">{col.ariaLabel}</span>
                        <SkeletonBar
                          className={cn("h-3.5", col.headerBarClass)}
                        />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className="border-gray-200 hover:bg-slate-50/50"
                    >
                      {columns.map((col, ci) => (
                        <TableCell
                          key={`${rowIndex}-${ci}`}
                          className={cn("p-3 align-middle text-sm", col.widthClass)}
                        >
                          {col.renderCell()}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {showPagination ? <SkeletonPaginationFooter /> : null}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Celdas reutilizables ── */

export function SkeletonCellAvatarEmail() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <SkeletonBar className="h-9 w-9 shrink-0 rounded-full" />
      <SkeletonBar className="h-3.5 min-w-0 flex-1 max-w-[12rem]" />
    </div>
  );
}

export function SkeletonCellPill({ className }: { className?: string }) {
  return <SkeletonBar className={cn("h-6 w-20 rounded-full", className)} />;
}

export function SkeletonCellText({ className }: { className?: string }) {
  return <SkeletonBar className={cn("h-3.5 w-full max-w-[10rem]", className)} />;
}

export function SkeletonCellActions({ lines = 2 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBar key={i} className="h-3 w-16" />
      ))}
    </div>
  );
}

export function SkeletonCellOrgTenant() {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <SkeletonBar className="h-3.5 w-[85%] max-w-[11rem]" />
      <SkeletonBar className="h-3 w-14" />
    </div>
  );
}

export function SkeletonCellBadgeRow({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBar key={i} className="h-5 w-12 shrink-0 rounded" />
      ))}
    </div>
  );
}

const USERS_TABLE_COLUMNS: DataTableSkeletonColumn[] = [
  {
    widthClass: "w-[28%]",
    headerBarClass: "max-w-[7rem] w-full",
    ariaLabel: "Usuario",
    renderCell: () => <SkeletonCellAvatarEmail />,
  },
  {
    widthClass: "w-[14%]",
    headerBarClass: "w-16",
    ariaLabel: "Rol",
    renderCell: () => <SkeletonCellPill className="w-[4.5rem]" />,
  },
  {
    widthClass: "w-[14%]",
    headerBarClass: "w-14",
    ariaLabel: "Estado",
    renderCell: () => <SkeletonCellPill className="w-16" />,
  },
  {
    widthClass: "w-[22%]",
    headerBarClass: "max-w-[9rem] w-full",
    ariaLabel: "Fecha de creación",
    renderCell: () => <SkeletonCellText className="max-w-[9rem]" />,
  },
  {
    widthClass: "w-[22%]",
    headerBarClass: "w-20",
    ariaLabel: "Acciones",
    renderCell: () => <SkeletonCellActions lines={3} />,
  },
];

export function UsersTableSkeleton(props: Omit<DataTableSkeletonProps, "columns">) {
  return <DataTableSkeleton {...props} columns={USERS_TABLE_COLUMNS} />;
}

const TENANTS_TABLE_COLUMNS: DataTableSkeletonColumn[] = [
  {
    widthClass: "w-[20%]",
    headerBarClass: "max-w-[6.5rem] w-full",
    ariaLabel: "Organización",
    renderCell: () => <SkeletonCellOrgTenant />,
  },
  {
    widthClass: "w-[30%]",
    headerBarClass: "max-w-[8rem] w-full",
    ariaLabel: "Menú por rol",
    renderCell: () => <SkeletonCellBadgeRow count={4} />,
  },
  {
    widthClass: "w-[14%]",
    headerBarClass: "w-20",
    ariaLabel: "Creación",
    renderCell: () => <SkeletonCellText className="max-w-[6.5rem]" />,
  },
  {
    widthClass: "w-[14%]",
    headerBarClass: "w-24",
    ariaLabel: "Última actualización",
    renderCell: () => <SkeletonCellText className="max-w-[6.5rem]" />,
  },
  {
    widthClass: "w-[22%]",
    headerBarClass: "w-16",
    ariaLabel: "Acciones",
    renderCell: () => <SkeletonCellActions lines={3} />,
  },
];

/** Mismo layout que usuarios: buscador + tabla + paginación en skeleton (todo gris). */
export function TenantsTableSkeleton(
  props: Omit<DataTableSkeletonProps, "columns">,
) {
  return (
    <DataTableSkeleton
      {...props}
      columns={TENANTS_TABLE_COLUMNS}
      showSearch={props.showSearch ?? true}
      showPagination={props.showPagination ?? true}
    />
  );
}

const CONTACTS_TABLE_COLUMNS: DataTableSkeletonColumn[] = [
  {
    widthClass: "w-[26%]",
    headerBarClass: "max-w-[6rem]",
    ariaLabel: "Nombre",
    renderCell: () => <SkeletonCellAvatarEmail />,
  },
  {
    widthClass: "w-[22%]",
    headerBarClass: "max-w-[5rem]",
    ariaLabel: "Email",
    renderCell: () => <SkeletonCellText className="max-w-[11rem]" />,
  },
  {
    widthClass: "w-[18%]",
    headerBarClass: "w-24",
    ariaLabel: "Teléfono",
    renderCell: () => <SkeletonCellText className="max-w-[9rem]" />,
  },
  {
    widthClass: "w-[18%]",
    headerBarClass: "w-28",
    ariaLabel: "Fecha",
    renderCell: () => <SkeletonCellText className="max-w-[10rem]" />,
  },
  {
    widthClass: "w-[15%]",
    headerBarClass: "w-20",
    ariaLabel: "Acciones",
    renderCell: () => <SkeletonCellActions lines={2} />,
  },
];

export function ContactsTableSkeleton(
  props: Omit<DataTableSkeletonProps, "columns">,
) {
  return (
    <DataTableSkeleton
      {...props}
      columns={CONTACTS_TABLE_COLUMNS}
      showSearch={props.showSearch ?? true}
      showPagination={props.showPagination ?? true}
    />
  );
}
