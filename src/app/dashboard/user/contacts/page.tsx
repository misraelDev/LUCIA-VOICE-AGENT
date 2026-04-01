"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/data-table";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  IconId,
  IconPhone,
  IconCalendar,
  IconUser,
} from "@tabler/icons-react";
import { z } from "zod";
import {
  listContacts,
  subscribeToContactEvents,
  deleteContact,
  type Contact,
  type ContactListMeta,
} from "@/services/ContactService";
import { cn } from "@/lib/utils";
import { CreateContactModal } from "@/components/create-contact-modal";
import { EditContactModal } from "@/components/edit-contact-modal";
import { ImportContactsModal } from "@/components/import-contacts-modal";
import { PageHeaderActions } from "@/components/page-header";
import { ContactsTableSkeleton } from "@/components/data-table-skeleton";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { toast } from "sonner";

// Definimos el schema de Zod para los contactos
const contactSchema = z.object({
  id: z.number(),
  contact_id: z.number(),
  email: z.string().nullable(),
  phone_number: z.number().nullable(),
  creation_date: z.string().nullable(),
  name: z.string().nullable(),
});

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

function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [listMeta, setListMeta] = useState<ContactListMeta | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactPendingDelete, setContactPendingDelete] =
    useState<Contact | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const router = useRouter();

  // Definimos las columnas de la tabla dentro del componente
  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="flex items-center gap-2">
          <IconUser className="size-4" />
          <span>Nombre</span>
        </div>
      ),
      cell: ({ row }) => {
        const name = row.original.name;
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
            <span>{name || "N/A"}</span>
          </div>
        );
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: "email",
      header: () => (
        <div className="flex items-center gap-2">
          <IconId className="size-4" />
          <span>Email</span>
        </div>
      ),
      cell: ({ row }) => {
        return <span>{row.original.email || "N/A"}</span>;
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: "phone_number",
      header: () => (
        <div className="flex items-center gap-2">
          <IconPhone className="size-4" />
          <span>Teléfono</span>
        </div>
      ),
      cell: ({ row }) => {
        const phone = row.original.phone_number;
        return (
          <span>
            {phone ? phone.toString() : "No hay un teléfono disponible"}
          </span>
        );
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: "creation_date",
      header: () => (
        <div className="flex items-center gap-2">
          <IconCalendar className="size-4" />
          <span>Fecha de Creación</span>
        </div>
      ),
      cell: ({ row }) => {
        const date = row.original.creation_date
          ? new Date(row.original.creation_date)
          : null;
        if (!date) return <div className="text-sm">N/A</div>;

        return (
          <div className="text-sm">
            {date.toLocaleDateString()}{" "}
            <span className="text-[#2484fd]">{date.toLocaleTimeString()}</span>
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
      cell: ({ row }) => {
        const c = row.original;
        return (
          <DataTableRowActions
            viewHref={`/dashboard/user/contacts/${c.contact_id}`}
            onEdit={() => setEditingContact(c)}
            onDelete={() => setContactPendingDelete(c)}
          />
        );
      },
    },
  ];

  const validateAndTransformData = (data: unknown[]): Contact[] => {
    return data
      .map((item) => {
        try {
          if (typeof item !== "object" || item === null) {
            return null;
          }

          const itemObj = item as Record<string, unknown>;
          const transformedItem = {
            id: typeof itemObj.id === "number" ? itemObj.id : 0,
            contact_id:
              typeof itemObj.contact_id === "number" ? itemObj.contact_id : 0,
            email: typeof itemObj.email === "string" ? itemObj.email : null,
            phone_number:
              typeof itemObj.phone_number === "number"
                ? itemObj.phone_number
                : null,
            creation_date:
              typeof itemObj.creation_date === "string"
                ? itemObj.creation_date
                : null,
            name: typeof itemObj.name === "string" ? itemObj.name : null,
          };
          return contactSchema.parse(transformedItem);
        } catch {
          return null;
        }
      })
      .filter((item): item is Contact => item !== null);
  };

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await listContacts({ page, per_page: perPage });

      if (response.success && response.contacts && response.meta) {
        const validatedData = validateAndTransformData(response.contacts);
        setContacts(validatedData);
        setListMeta(response.meta);
      } else {
        console.error("Error al cargar contactos:", response.error);
        setContacts([]);
        setListMeta(null);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setContacts([]);
      setListMeta(null);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage]);

  useEffect(() => {
    fetchContacts();

    // Verificar si hay un parámetro de actualización en la URL
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("refresh") === "true") {
      // Limpiar el parámetro de la URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    // Suscribirse a eventos de WebSocket para actualizaciones en tiempo real
    const unsubscribeCreated = subscribeToContactEvents(
      "contactCreated",
      (newContact) => {
        console.log("Nuevo contacto creado:", newContact);
        fetchContacts(); // Recargar la lista
      },
    );

    const unsubscribeUpdated = subscribeToContactEvents(
      "contactUpdated",
      (updatedContact) => {
        console.log("Contacto actualizado:", updatedContact);
        fetchContacts(); // Recargar la lista
      },
    );

    const unsubscribeDeleted = subscribeToContactEvents(
      "contactDeleted",
      (deletedContact) => {
        console.log("Contacto eliminado:", deletedContact);
        fetchContacts(); // Recargar la lista
      },
    );

    // Limpiar suscripciones al desmontar el componente
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeDeleted();
    };
  }, [fetchContacts]);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleContactCreated = () => {
    if (page !== 1) setPage(1);
    else void fetchContacts();
  };

  const handleContactUpdated = () => {
    void fetchContacts();
  };

  const confirmDeleteContact = async () => {
    if (!contactPendingDelete) return;
    setDeleteSubmitting(true);
    try {
      const response = await deleteContact(contactPendingDelete.contact_id);
      if (!response.success) {
        throw new Error(response.error || "No se pudo eliminar el contacto");
      }
      toast.success("Contacto eliminado", {
        description: "El contacto se eliminó del sistema.",
      });
      setContactPendingDelete(null);
      void fetchContacts();
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      toast.error("Error al eliminar el contacto", {
        description:
          error instanceof Error ? error.message : "Ocurrió un error inesperado",
      });
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleFileImport = () => {
    setIsImportModalOpen(true);
  };

  const handleImportModalClose = () => {
    setIsImportModalOpen(false);
  };

  const handleImportComplete = () => {
    fetchContacts();
    setIsImportModalOpen(false);
  };

  return (
    <>
      <PageHeaderActions>
        <Button
          onClick={handleFileImport}
          className="relative shadow-[0px_1px_3px_rgba(166,_175,_195,_0.4)] rounded-md bg-ghostwhite border-[#1868db] border-solid border-[1px] box-border flex flex-row items-center justify-center py-2.5 px-4 gap-2 text-center text-base text-[#1868db] font-inter hover:bg-[#1868db] hover:text-white transition-colors group"
        >
          <div className="relative h-4 w-4 shrink-0">
            <Image
              className="object-contain group-hover:brightness-0 group-hover:invert"
              fill
              alt="Import icon"
              src="/importar.svg"
              sizes="16px"
            />
          </div>
          <div className="relative leading-6 font-medium">Importar</div>
        </Button>
        <Button
          onClick={handleCreateClick}
          className="rounded-md bg-[#1868db] hover:bg-[#1458c4] flex flex-row items-center justify-center py-2.5 px-4 gap-2.5 text-white"
        >
          <div className="w-5 relative h-5 shrink-0 overflow-hidden flex items-center justify-center">
            <Image
              className="w-full h-full overflow-hidden shrink-0 object-cover absolute left-[0px] top-[0px] [transform:scale(1)] brightness-0 invert"
              fill
              alt="Add contact icon"
              src="/guardar.svg"
            />
          </div>
          <div className="relative leading-6 font-medium text-white">
            Nuevo contacto
          </div>
        </Button>
      </PageHeaderActions>
      {/* Contactos: paginación desde el API (page / per_page), pie como usuarios admin */}
      <div className="flex flex-col gap-6 p-6">
        <div className="w-full space-y-2">
          {isLoading && contacts.length === 0 ? (
            <ContactsTableSkeleton
              rowCount={perPage > 0 ? Math.min(perPage, 10) : 8}
            />
          ) : listMeta ? (
            <DataTable<Contact, typeof contactSchema>
              data={contacts}
              columns={columns}
              schema={contactSchema}
              enableRowSelection={false}
              enableDragAndDrop={false}
              enablePagination={true}
              pageSize={perPage}
              onRowClick={(row: Contact) => {
                const contactId = row.contact_id;
                if (contactId) {
                  router.push(`/dashboard/user/contacts/${contactId}`);
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
            />
          ) : (
            <div className="text-center py-8 ">
              No se pudo cargar la lista de contactos
            </div>
          )}
        </div>
      </div>

      {/* Modal de creación de contacto */}
      <CreateContactModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onContactCreated={handleContactCreated}
      />

      {/* Modal de importación de contactos */}
      <ImportContactsModal
        isOpen={isImportModalOpen}
        onClose={handleImportModalClose}
        onImportComplete={handleImportComplete}
      />

      <EditContactModal
        isOpen={editingContact != null}
        onClose={() => setEditingContact(null)}
        contact={editingContact}
        onContactUpdated={handleContactUpdated}
      />

      <ConfirmDeleteDialog
        open={contactPendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setContactPendingDelete(null);
        }}
        title="Eliminar contacto"
        description={
          <>
            ¿Eliminar a{" "}
            <span className="font-medium text-foreground">
              {contactPendingDelete?.name || "este contacto"}
            </span>
            ? Esta acción no se puede deshacer.
          </>
        }
        onConfirm={confirmDeleteContact}
        submitting={deleteSubmitting}
      />
    </>
  );
}
export default ContactsPage;
