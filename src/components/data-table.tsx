"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SlidersHorizontal } from "lucide-react"
import type { PaginationState, Updater } from "@tanstack/react-table"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  type Table as TableInstance,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon"
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BaseData {
  id: string | number
}

/** Paginación servida por API: los datos ya son la página actual. */
export type DataTableServerPagination = {
  total: number
  pageCount: number
  pageIndex: number
  pageSize: number
  onPaginationChange: (next: PaginationState) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DraggableRow<TData extends BaseData>({ row }: { row: Row<TData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-100/80 data-[dragging=true]:z-10 data-[dragging=true]:bg-slate-100 data-[dragging=true]:opacity-90 rounded-md"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="p-3 text-sm last:border-r-0">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}



export function DataTable<TData extends BaseData, TSchema extends z.ZodType<TData>>({
  data: initialData,
  columns,
  schema,
  enableRowSelection = false,
  enableDragAndDrop = false,
  enablePagination = false,
  pageSize = 10,
  onRowClick,
  searchButton,
  serverPagination,
}: {
  data: TData[]
  columns: ColumnDef<TData>[]
  schema: TSchema
  enableRowSelection?: boolean
  enableDragAndDrop?: boolean
  enablePagination?: boolean
  pageSize?: number
  onRowClick?: (row: TData, event: React.MouseEvent<HTMLElement>) => void
  searchButton?: {
    icon: React.ReactNode
    text: string
    onClick: () => void
  }
  serverPagination?: DataTableServerPagination
}) {
  // Validar los datos con el schema
  const validatedData = React.useMemo(() => {
    return initialData.map((item) => {
      try {
        return schema.parse(item)
      } catch (error) {
        console.error("Error validating data:", error)
        return item
      }
    })
  }, [initialData, schema])

  const [data, setData] = React.useState(() => validatedData)
  
  // Agregar useEffect para actualizar los datos cuando initialData cambie
  React.useEffect(() => {
    const newValidatedData = initialData.map((item) => {
      try {
        return schema.parse(item)
      } catch (error) {
        console.error("Error validating data:", error)
        return item
      }
    })
    setData(newValidatedData)
  }, [initialData, schema])

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  })

  React.useEffect(() => {
    if (!serverPagination) {
      setPagination((p) => (p.pageSize === pageSize ? p : { ...p, pageSize, pageIndex: 0 }))
    }
  }, [pageSize, serverPagination])

  const paginationState: PaginationState = serverPagination
    ? {
        pageIndex: serverPagination.pageIndex,
        pageSize: serverPagination.pageSize,
      }
    : pagination

  const onPaginationChange = React.useCallback(
    (updater: Updater<PaginationState>) => {
      if (serverPagination) {
        const prev: PaginationState = {
          pageIndex: serverPagination.pageIndex,
          pageSize: serverPagination.pageSize,
        }
        const next = typeof updater === "function" ? updater(prev) : updater
        serverPagination.onPaginationChange(next)
      } else {
        setPagination((prev) => (typeof updater === "function" ? updater(prev) : updater))
      }
    },
    [serverPagination],
  )
  const sortableId = React.useId()
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data])

  const [globalFilter, setGlobalFilter] = React.useState("")

  const table = useReactTable({
    data,
    columns,
    manualPagination: !!serverPagination,
    pageCount: serverPagination?.pageCount,
    rowCount: serverPagination?.total,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: paginationState,
      globalFilter,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(serverPagination
      ? {}
      : { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    if (!enableDragAndDrop) return

    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <Card className="w-full border-gray-300">
        <CardContent className="px-4 py-3">
          <div className="w-full flex flex-col justify-start gap-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-0">
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="w-full md:w-64">
                  <InputWithIcon
                    icon={Search}
                    placeholder="Buscar..."
                    value={globalFilter ?? ""}
                    onChange={(v) => setGlobalFilter(v)}
                    className={cn(AUTH_INPUT_FIELD_CLASS, "w-full")}
                    aria-label="Buscar en la tabla"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {searchButton && (
                  <Button
                    onClick={searchButton.onClick}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                  >
                    {searchButton.icon}
                    {searchButton.text}
                  </Button>
                )}
              </div>
            </div>
            <div className="relative flex min-w-0 max-w-full flex-col px-0 pt-1">
              {/* Misma tarjeta Card; un solo bloque con scroll (sin caja interior duplicada). */}
              <div className="h-[31rem] w-full min-w-0 max-w-full overflow-y-auto overflow-x-auto overscroll-contain">
                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                  id={sortableId}
                >
                  <Table
                    containerClassName="overflow-visible"
                    className="table-fixed min-w-[42rem]"
                  >
                    <TableHeader className="sticky top-0 z-10 bg-white shadow-[0_1px_0_0_rgb(203_213_225)]">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent">
                          {headerGroup.headers.map((header) => {
                            return (
                              <TableHead
                                key={header.id}
                                colSpan={header.colSpan}
                                className="h-12 px-4 text-sm font-medium text-slate-700"
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(header.column.columnDef.header, header.getContext())}
                              </TableHead>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                          {table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              onClick={(event) => onRowClick?.(row.original, event)}
                              className="cursor-pointer transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-100/80"
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="p-3 text-sm">
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </SortableContext>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-16 text-center">
                            <div className="flex flex-col items-center justify-center gap-1 py-4">
                              <p className="text-slate-600 font-medium">No hay datos disponibles</p>
                              <p className="text-sm text-slate-500">Intenta ajustar tus filtros o busca algo diferente</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </DndContext>
              </div>
            </div>
            {enablePagination ? (
              <div className="mt-2 flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:px-0">
                <div className="order-2 text-sm text-slate-500 sm:order-1">
                  {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                    <span>
                      {table.getFilteredSelectedRowModel().rows.length} de{" "}
                      {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s)
                    </span>
                  ) : serverPagination ? (
                    <span>
                      Total: {serverPagination.total}
                      {table.getFilteredRowModel().rows.length !== serverPagination.total
                        ? ` · esta página: ${table.getFilteredRowModel().rows.length}`
                        : null}
                    </span>
                  ) : (
                    <span>
                      Mostrando un total de {table.getFilteredRowModel().rows.length}{" "}
                      resultado(s)
                    </span>
                  )}
                </div>
                <div className="order-1 flex w-full flex-col items-center gap-4 sm:order-2 sm:w-auto sm:flex-row sm:gap-8">
                  <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
                    <p className="text-sm font-medium text-slate-600">Resultados por página</p>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => {
                        table.setPageSize(Number(value))
                      }}
                    >
                      <SelectTrigger className="h-9 w-[70px] border-slate-200">
                        <SelectValue placeholder={table.getState().pagination.pageSize} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((size) => (
                          <SelectItem key={`page-size-${size}`} value={`${size}`}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-center">
                    <div className="text-sm font-medium text-slate-600">
                      Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        className="h-9 w-9 border-slate-200 p-0 transition-colors hover:bg-[#1868db] hover:text-white"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Ir a la primera página</span>
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-9 w-9 border-slate-200 p-0 transition-colors hover:bg-[#1868db] hover:text-white"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Ir a la página anterior</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-9 w-9 border-slate-200 p-0 transition-colors hover:bg-[#1868db] hover:text-white"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Ir a la página siguiente</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-9 w-9 border-slate-200 p-0 transition-colors hover:bg-[#1868db] hover:text-white"
                        size="icon"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Ir a la última página</span>
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function DataTableViewOptions<TData>({ table }: { table: TableInstance<TData> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 px-3 flex items-center gap-2 border-slate-200">
          <SlidersHorizontal className="size-4" />
          <span>Columnas</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuItem key={column.id} className="capitalize">
                <div
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault()
                    column.toggleVisibility(!column.getIsVisible())
                  }}
                >
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={() => column.toggleVisibility(!column.getIsVisible())}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span>{column.id}</span>
                </div>
              </DropdownMenuItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
