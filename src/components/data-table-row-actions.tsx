"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconEye, IconEdit, IconTrash } from "@tabler/icons-react";

const wrapClass = "flex flex-wrap items-center gap-1";

const btnBase =
  "group h-8 px-1.5 shadow-none bg-transparent hover:bg-transparent dark:hover:bg-transparent focus-visible:ring-0 focus-visible:border-transparent focus-visible:shadow-none";

const btnView = `${btnBase} text-blue-600 hover:text-blue-700`;

const btnEdit = `${btnBase} text-slate-700 hover:text-slate-900 flex items-center gap-1`;

const btnDelete = `${btnBase} text-red-600 hover:text-red-700 flex items-center gap-1`;

const labelClass =
  "hidden sm:inline underline-offset-4 decoration-2 group-hover:underline group-focus-visible:underline";

type StopProps = { children: ReactNode };

function StopRowClick({ children }: StopProps) {
  return (
    <div
      className={wrapClass}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      role="presentation"
    >
      {children}
    </div>
  );
}

export type DataTableRowActionsProps = {
  /** Navegación tipo enlace (preferido si hay ruta fija). */
  viewHref?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  deleteTitle?: string;
};

export function DataTableRowActions({
  viewHref,
  onView,
  onEdit,
  onDelete,
  editDisabled,
  deleteDisabled,
  deleteTitle,
}: DataTableRowActionsProps) {
  const showView = viewHref != null || onView != null;

  return (
    <StopRowClick>
      {showView ? (
        viewHref != null ? (
          <Button variant="ghost" size="sm" className={btnView} asChild>
            <Link href={viewHref} className="flex items-center gap-1">
              <IconEye className="size-4 shrink-0" />
              <span className={labelClass}>Ver</span>
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`${btnView} flex items-center gap-1`}
            onClick={onView}
          >
            <IconEye className="size-4 shrink-0" />
            <span className={labelClass}>Ver</span>
          </Button>
        )
      ) : null}

      {onEdit != null ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={btnEdit}
          disabled={editDisabled}
          onClick={onEdit}
        >
          <IconEdit className="size-4 shrink-0" />
          <span className={labelClass}>Editar</span>
        </Button>
      ) : null}

      {onDelete != null ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={btnDelete}
          disabled={deleteDisabled}
          title={deleteTitle}
          onClick={onDelete}
        >
          <IconTrash className="size-4 shrink-0" />
          <span className={labelClass}>Eliminar</span>
        </Button>
      ) : null}
    </StopRowClick>
  );
}
