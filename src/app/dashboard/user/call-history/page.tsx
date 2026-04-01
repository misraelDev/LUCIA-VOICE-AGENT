"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getCalls,
  deleteCall,
  subscribeToCallEvents,
  disconnectWebSocket,
  type CallsListMeta,
} from "@/services/user/CallService";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";

import Image from "next/image";
import { DataTable } from "@/components/data-table";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { IconCalendar, IconUser } from "@tabler/icons-react";
import { z } from "zod";

import { format, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { PageHeaderActions } from "@/components/page-header";
import { DataTableRowActions } from "@/components/data-table-row-actions";

// Definimos el schema de Zod para las llamadas
const callSchema = z.object({
  id: z.number(),
  call_id: z.string().optional(),
  date: z.string().nullable(),
  duration: z.number().nullable(),
  motive: z.string().nullable(),
  contactName: z.string().nullable(),
  contact_id: z.number().nullable().optional(),
});

type CallType = z.infer<typeof callSchema>;

/** v2: mes completo por defecto (antes "hoy→+30 d" ocultaba la mayoría de llamadas del mes). */
const CALL_HISTORY_LS_START = "callHistoryStartDate_v2";
const CALL_HISTORY_LS_END = "callHistoryEndDate_v2";

// Add this function at the top level, before the columns definition
function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getCallHistoryColumns(
  onRequestDelete: (row: CallType) => void,
): ColumnDef<CallType>[] {
  return [
  {
    accessorKey: "contactName",
    header: () => (
      <div className="flex items-center gap-2">
        <IconUser className="size-4" />
        <span>Contacto</span>
      </div>
    ),
    cell: ({ row }) => {
      const name = row.original.contactName;
      const initials = getInitials(name);
      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600",
              "font-medium text-sm",
            )}
          >
            {initials}
          </div>
          <span>{name || "Sin nombre"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => (
      <div className="flex items-center gap-2">
        <IconCalendar className="size-4" />
        <span>Fecha y hora de la llamada</span>
      </div>
    ),
    cell: ({ row }) => {
      if (!row.original.date)
        return <div className="flex items-center gap-2 text-sm">N/A</div>;

      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString();

      return (
        <div className="flex items-center gap-2 text-sm">
          {formattedDate}{" "}
          <span style={{ color: "#2484fd" }}>{formattedTime}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: () => (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 relative">
          <Image
            src="/columna_duracion.svg"
            alt="Duración"
            fill
            className="object-contain"
          />
        </div>
        <span>Duración</span>
      </div>
    ),
    cell: ({ row }) => {
      const formatDuration = (seconds: number | null) => {
        if (!seconds) return "N/A";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes} minutos, ${remainingSeconds} segundos`;
      };

      return (
        <div className="flex items-center gap-2 font-mono text-sm">
          <div className="w-3.5 h-3.5 relative">
            <Image
              src="/duracion.svg"
              alt="Duración"
              fill
              className="object-contain "
            />
          </div>
          {formatDuration(row.original.duration)}
        </div>
      );
    },
  },
  {
    accessorKey: "motive",
    header: () => (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 relative">
          <Image
            src="/columna_motivo.svg"
            alt="Motivo"
            fill
            className="object-contain"
          />
        </div>
        <span>Motivo</span>
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="min-h-[60px] flex items-center text-sm max-w-[200px] whitespace-normal break-words">
          {row.original.motive ?? "No hay un motivo definido"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="flex items-center gap-2">
        <span>Acciones</span>
      </div>
    ),
    cell: ({ row }) => (
      <DataTableRowActions
        viewHref={`/dashboard/user/call-history/${row.original.id}`}
        onDelete={() => onRequestDelete(row.original)}
      />
    ),
  },
];
}

// Componente simplificado de rango de fechas
function DateRangeButton({
  startDate,
  endDate,
  onDateRangeChange,
}: {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (start: Date, end: Date) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date>(endDate);

  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, "dd/MM/yyyy")} - ${format(end, "dd/MM/yyyy")}`;
  };

  const handleApply = () => {
    onDateRangeChange(tempStartDate, tempEndDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[280px] justify-start text-left font-normal"
        >
          <IconCalendar className="mr-2 h-4 w-4" />
          {formatDateRange(startDate, endDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Desde</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <IconCalendar className="mr-2 h-4 w-4" />
                    {format(tempStartDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempStartDate}
                    onSelect={(date) => {
                      if (date instanceof Date) {
                        setTempStartDate(date);
                        if (date > tempEndDate) {
                          setTempEndDate(date);
                        }
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <IconCalendar className="mr-2 h-4 w-4" />
                    {format(tempEndDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempEndDate}
                    onSelect={(date) => {
                      if (date instanceof Date && date >= tempStartDate) {
                        setTempEndDate(date);
                      }
                    }}
                    disabled={(date) => date < tempStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleApply}>Aplicar</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function CallHistoryPage() {
  const router = useRouter();
  const [calls, setCalls] = useState<CallType[]>([]);
  const [listMeta, setListMeta] = useState<CallsListMeta | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [callPendingDelete, setCallPendingDelete] = useState<CallType | null>(
    null,
  );
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const requestDeleteCall = useCallback((row: CallType) => {
    setCallPendingDelete(row);
  }, []);

  const columns = useMemo(
    () => getCallHistoryColumns(requestDeleteCall),
    [requestDeleteCall],
  );

  const [startDate, setStartDate] = useState<Date>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CALL_HISTORY_LS_START);
      if (saved) return new Date(saved);
    }
    return startOfMonth(new Date());
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(CALL_HISTORY_LS_END);
      if (saved) return new Date(saved);
    }
    return endOfMonth(new Date());
  });
  // Save date range to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(CALL_HISTORY_LS_START, startDate.toISOString());
      localStorage.setItem(CALL_HISTORY_LS_END, endDate.toISOString());
    }
  }, [startDate, endDate]);

  const validateAndTransformData = (data: unknown[]): CallType[] => {
    return data
      .map((item) => {
        try {
          if (typeof item !== "object" || item === null) {
            return null;
          }

          const itemObj = item as Record<string, unknown>;
          const cidRaw = itemObj.contactId ?? itemObj.contact_id;
          const contact_id =
            typeof cidRaw === "number" && Number.isFinite(cidRaw)
              ? cidRaw
              : typeof cidRaw === "string" && cidRaw.trim() !== ""
                ? Number(cidRaw)
                : null;
          const transformedItem = {
            call_id: typeof itemObj.call_id === "string" ? itemObj.call_id : "",
            id:
              typeof itemObj.id === "number" && !isNaN(itemObj.id)
                ? itemObj.id
                : 0,
            date: typeof itemObj.date === "string" ? itemObj.date : null,
            duration:
              typeof itemObj.duration === "number" && !isNaN(itemObj.duration)
                ? itemObj.duration
                : null,
            motive: typeof itemObj.motive === "string" ? itemObj.motive : null,
            contactName:
              typeof itemObj.contactName === "string"
                ? itemObj.contactName
                : null,
            contact_id:
              contact_id != null && Number.isFinite(contact_id)
                ? contact_id
                : null,
          };
          return callSchema.parse(transformedItem);
        } catch (error) {
          console.error("Error validating data:", error);
          return null;
        }
      })
      .filter((item): item is CallType => item !== null);
  };

  const fetchCalls = useCallback(async () => {
    try {
      setIsLoading(true);
      const from = format(startDate, "yyyy-MM-dd");
      const to = format(endDate, "yyyy-MM-dd");
      const response = await getCalls({
        page,
        per_page: perPage,
        from,
        to,
      });

      if (response.success && response.calls && response.meta) {
        const validatedData = validateAndTransformData(response.calls);
        setCalls(validatedData);
        setListMeta(response.meta);
      } else {
        console.error("Error loading calls:", response.error);
        setCalls([]);
        setListMeta(null);
      }
    } catch (error) {
      console.error("Error loading calls:", error);
      setCalls([]);
      setListMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, startDate, endDate]);

  const handleDateRangeChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  };

  useEffect(() => {
    fetchCalls();

    // Suscribirse a eventos WebSocket
    const unsubscribeCreated = subscribeToCallEvents("callCreated", () => {
      fetchCalls(); // Actualizar cuando se crea una llamada
    });

    const unsubscribeUpdated = subscribeToCallEvents("callUpdated", () => {
      fetchCalls(); // Actualizar cuando se actualiza una llamada
    });

    const unsubscribeDeleted = subscribeToCallEvents("callDeleted", () => {
      fetchCalls(); // Actualizar cuando se elimina una llamada
    });

    // Verificar si hay un parámetro de actualización en la URL
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("refresh") === "true") {
      // Limpiar el parámetro de la URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    // Limpiar la suscripción cuando el componente se desmonte
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
      disconnectWebSocket();
    };
  }, [fetchCalls]);

  const confirmDeleteCall = useCallback(async () => {
    if (!callPendingDelete) return;
    setDeleteSubmitting(true);
    try {
      const r = await deleteCall(callPendingDelete.id);
      if (!r.success) {
        toast.error(r.error ?? "No se pudo eliminar la llamada");
        return;
      }
      toast.success("Llamada eliminada");
      setCallPendingDelete(null);
      void fetchCalls();
    } finally {
      setDeleteSubmitting(false);
    }
  }, [callPendingDelete, fetchCalls]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeaderActions>
        <DateRangeButton
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
        />
      </PageHeaderActions>

      {/* Info Section */}
      <div className="flex items-center gap-2 text-sm ">
        <IconCalendar className="size-4" />
        <span>
          {listMeta
            ? `Total ${listMeta.total} llamadas (${format(startDate, "d/MM/yyyy", { locale: es })} – ${format(endDate, "d/MM/yyyy", { locale: es })})`
            : `Rango ${format(startDate, "d/MM/yyyy", { locale: es })} – ${format(endDate, "d/MM/yyyy", { locale: es })}`}
        </span>
      </div>

      {/* Paginación desde el API (page / per_page / from / to), pie como usuarios admin */}
      <div className="w-full space-y-2">
        {isLoading && calls.length === 0 ? (
          <div className="text-center py-8 ">Cargando llamadas...</div>
        ) : listMeta ? (
          <div className="[&_tr]:min-h-[60px]">
            <DataTable<CallType, typeof callSchema>
              data={calls}
              columns={columns}
              schema={callSchema}
              enableRowSelection={false}
              enableDragAndDrop={false}
              enablePagination={true}
              pageSize={perPage}
              onRowClick={(row: CallType) => {
                if (row.id) {
                  router.push(`/dashboard/user/call-history/${row.id}`);
                }
              }}
              serverPagination={{
                total: listMeta.total,
                pageCount: listMeta.last_page,
                pageIndex: page - 1,
                pageSize: perPage,
                onPaginationChange: (next: PaginationState) => {
                  if (next.pageSize !== perPage) {
                    setPerPage(next.pageSize);
                    setPage(1);
                  } else if (next.pageIndex !== page - 1) {
                    setPage(next.pageIndex + 1);
                  }
                },
              }}
              key={`calls-${page}-${perPage}-${startDate.toISOString()}-${endDate.toISOString()}`}
            />
          </div>
        ) : (
          <div className="text-center py-8 ">
            No se pudieron cargar las llamadas para el rango seleccionado
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={callPendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setCallPendingDelete(null);
        }}
        title="Eliminar llamada"
        description={
          <>
            ¿Eliminar esta llamada
            {callPendingDelete?.date ? (
              <>
                {" "}
                del{" "}
                <span className="font-medium text-foreground">
                  {new Date(callPendingDelete.date).toLocaleString()}
                </span>
              </>
            ) : null}
            ? Esta acción no se puede deshacer.
          </>
        }
        onConfirm={confirmDeleteCall}
        submitting={deleteSubmitting}
      />
    </div>
  );
}

export default CallHistoryPage;
