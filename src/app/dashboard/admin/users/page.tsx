"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { DataTable } from "@/components/data-table"
import type { ColumnDef, PaginationState } from "@tanstack/react-table"
import { IconUser, IconMail, IconCalendar, IconPlus, IconShield } from "@tabler/icons-react"
import { z } from "zod"
import {
  userService,
  subscribeToUserEvents,
  type UserListMeta,
} from "@/services/UserService"
import { type UserData } from "@/services/WebSocketService"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CreateUserModal } from "@/components/create-user-modal"
import { EditUserPanel } from "@/components/edit-user-panel"
import { formatRoleToSpanish } from "@/lib/format"
import { PageHeaderActions } from "@/components/page-header"
import { UsersTableSkeleton } from "@/components/data-table-skeleton"
import { DataTableRowActions } from "@/components/data-table-row-actions"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"

// Schema de Zod para los usuarios
const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  created_at: z.string(),
  email_confirmed: z.boolean(),
})

type UserType = z.infer<typeof userSchema>

// Función para obtener iniciales del email
function getInitials(email: string): string {
  if (!email) return "?"
  return email
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase()
}

function getColumns(
  handleEditUser: (id: string) => void,
  requestDeleteUser: (row: UserType) => void,
  currentUserId: string | null,
): ColumnDef<UserType>[] {
  return [
    {
      accessorKey: "email",
      header: () => (
        <div className="flex items-center gap-2">
          <IconUser className="size-4" />
          <span>Usuario</span>
        </div>
      ),
      cell: ({ row }) => {
        const email = row.original.email
        const initials = getInitials(email)
        return (
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600",
              "font-medium text-sm",
            )}>
              {initials}
            </div>
            <span className="font-medium">{email}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: () => (
        <div className="flex items-center gap-2">
          <IconShield className="size-4" />
          <span>Rol</span>
        </div>
      ),
      cell: ({ row }) => {
        const role = row.original.role
        const roleColors = {
          admin: "bg-red-100 text-red-800",
          seller: "bg-green-100 text-green-800",
          user: "bg-blue-100 text-blue-800",
        }
        return (
          <span className={cn(
            "px-2 py-1 rounded-full text-sm font-medium",
            roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800"
          )}>
            {formatRoleToSpanish(role)}
          </span>
        )
      },
    },
    {
      accessorKey: "email_confirmed",
      header: () => (
        <div className="flex items-center gap-2">
          <IconMail className="size-4" />
          <span>Estado</span>
        </div>
      ),
      cell: ({ row }) => {
        const confirmed = row.original.email_confirmed
        return (
          <span className={cn(
            "px-2 py-1 rounded-full text-sm font-medium",
            confirmed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          )}>
            {confirmed ? "Confirmado" : "Pendiente"}
          </span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: () => (
        <div className="flex items-center gap-2">
          <IconCalendar className="size-4" />
          <span>Fecha de creación</span>
        </div>
      ),
      cell: ({ row }) => {
        if (!row.original.created_at) return <span>N/A</span>
        const date = parseISO(row.original.created_at)
        return format(date, "dd/MM/yyyy 'a las' HH:mm", { locale: es })
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const isSelf =
          currentUserId != null && String(row.original.id) === String(currentUserId)
        return (
          <DataTableRowActions
            viewHref={`/dashboard/admin/users/${row.original.id}`}
            onEdit={() => handleEditUser(row.original.id)}
            onDelete={() => requestDeleteUser(row.original)}
            deleteDisabled={isSelf}
            deleteTitle={
              isSelf ? "No puedes eliminar tu propia sesión" : undefined
            }
          />
        )
      },
    },
  ]
}

function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserType[]>([])
  const [listMeta, setListMeta] = useState<UserListMeta | null>(null)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editPanelOpen, setEditPanelOpen] = useState(false)
  const [editUserId, setEditUserId] = useState<string | null>(null)
  const { isAdmin, user, loading } = useAuth()
  const currentUserId = user?.id ?? null
  const [userPendingDelete, setUserPendingDelete] = useState<UserType | null>(
    null,
  )
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)



  // WebSocket para usuarios
  useEffect(() => {
    // Suscribirse a nuevos usuarios
    const unsubscribeNewUser = subscribeToUserEvents('userCreated', (newUser) => {
      const userData = newUser as UserData
      // Agregar nuevo usuario a la lista
      setUsers(prev => {
        const converted = {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          created_at: userData.created_at,
          email_confirmed: userData.email_confirmed
        }
        // Verificar si ya existe para evitar duplicados
        if (prev.find(user => user.id === converted.id)) {
          return prev
        }
        return [converted, ...prev]
      })
      
      // Mostrar notificación
      toast.success(`Nuevo usuario creado: ${userData.email}`)
    })

    // Suscribirse a consulta de usuarios
    const unsubscribeUsersConsulted = subscribeToUserEvents('usersConsulted', (usersList) => {
      const usersData = usersList as UserData[]
      // Actualizar la lista completa de usuarios
      const converted = usersData.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        email_confirmed: user.email_confirmed
      }))
      setUsers(converted)
    })

    // Cleanup de suscripciones
    return () => {
      unsubscribeNewUser()
      unsubscribeUsersConsulted()
    }
  }, [])

  // Verificar que el usuario sea admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard')
    }
  }, [isAdmin, user, loading, router])

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)

      const result = await userService.getAllUsers({ page, per_page: perPage })

      if (result.success && result.data) {
        setListMeta(result.data.meta)
        const mappedUsers = result.data.data.map((u) => ({
          id: String(u.id),
          email: u.email,
          role: u.role || "user",
          created_at: u.created_at || "",
          email_confirmed: u.email_confirmed || false,
        }))
        setUsers(mappedUsers)
      } else {
        console.error("Error loading users:", result.error)
        toast.error(result.error || "Error al cargar usuarios")
        setUsers([])
        setListMeta(null)
      }
    } catch (err) {
      console.error("Error loading users:", err)
      toast.error("Error al cargar usuarios")
      setUsers([])
      setListMeta(null)
    } finally {
      setIsLoading(false)
    }
  }, [page, perPage])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleEditUser = (userId: string) => {
    setEditUserId(userId)
    setEditPanelOpen(true)
  }

  const requestDeleteUser = useCallback(
    (row: UserType) => {
      if (currentUserId != null && String(row.id) === String(currentUserId)) {
        toast.error("No puedes eliminar tu propia cuenta desde aquí")
        return
      }
      setUserPendingDelete(row)
    },
    [currentUserId],
  )

  const confirmDeleteUser = useCallback(async () => {
    if (!userPendingDelete) return
    setDeleteSubmitting(true)
    try {
      const r = await userService.deleteUser(userPendingDelete.id)
      if (!r.success) {
        toast.error(r.error ?? "No se pudo eliminar el usuario")
        return
      }
      toast.success("Usuario eliminado")
      if (editUserId === userPendingDelete.id) {
        setEditPanelOpen(false)
        setEditUserId(null)
      }
      setUserPendingDelete(null)
      void fetchUsers()
    } finally {
      setDeleteSubmitting(false)
    }
  }, [userPendingDelete, editUserId, fetchUsers])

  const closeEditPanel = () => {
    setEditPanelOpen(false)
    setEditUserId(null)
  }

  // Función para manejar el éxito de creación de usuario
  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    if (page !== 1) setPage(1)
    else void fetchUsers()
  }

  // No renderizar nada si no es admin o si está cargando
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  if (isAdmin === false) {
    return null
  }

  return (
    <>
            <div className="flex flex-1 flex-col gap-6 p-6">
              <PageHeaderActions>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <IconPlus className="size-4" />
                  Crear Usuario
                </Button>
              </PageHeaderActions>

              {/* Table */}
              <div className="w-full space-y-2">
                {isLoading && users.length === 0 ? (
                  <UsersTableSkeleton rowCount={perPage > 0 ? Math.min(perPage, 10) : 7} />
                ) : listMeta ? (
                  <DataTable<UserType, typeof userSchema>
                    data={users}
                    columns={getColumns(
                      handleEditUser,
                      requestDeleteUser,
                      currentUserId,
                    )}
                    schema={userSchema}
                    enableRowSelection={true}
                    enablePagination={true}
                    pageSize={perPage}
                    serverPagination={{
                      total: listMeta.total,
                      pageCount: listMeta.last_page ?? 1,
                      pageIndex: page - 1,
                      pageSize: perPage,
                      onPaginationChange: (next: PaginationState) => {
                        if (next.pageSize !== perPage) {
                          setPerPage(next.pageSize)
                          setPage(1)
                        } else if (next.pageIndex !== page - 1) {
                          setPage(next.pageIndex + 1)
                        }
                      },
                    }}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-600">
                    No se pudo cargar la lista de usuarios.
                  </div>
                )}
              </div>
            </div>

        {/* Modal de creación de usuario */}
        <CreateUserModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onUserCreated={handleCreateSuccess}
        />

        {editUserId != null ? (
          <EditUserPanel
            key={editUserId}
            isOpen={editPanelOpen}
            userId={editUserId}
            onClose={closeEditPanel}
            onSaved={() => void fetchUsers()}
          />
        ) : null}

      <ConfirmDeleteDialog
        open={userPendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setUserPendingDelete(null)
        }}
        title="Eliminar usuario"
        description={
          <>
            ¿Eliminar a{" "}
            <span className="font-medium text-foreground">
              {userPendingDelete?.email ?? "este usuario"}
            </span>
            ? Esta acción no se puede deshacer.
          </>
        }
        onConfirm={confirmDeleteUser}
        submitting={deleteSubmitting}
      />
    </>
  )
}

export default UsersPage