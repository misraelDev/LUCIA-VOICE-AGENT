"use client";

import { useEffect, useState } from "react";

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getConversations } from "@/services/conversations"
import { getMessages, deleteMessage } from "@/services/messages"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  User,
  Phone,
  Trash2,
  Loader2,
  X,
  Calendar,
  Clock,
  Search,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon";
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  remoteJid: string;
  pushName: string | null;
  profilePicUrl: string | null;
  createdAt: string;
  updatedAt: string;
  instanceId: string;
}

interface Message {
  id: string;
  key: {
    id: string;
    fromMe: boolean;
    remoteJid: string;
  };
  pushName: string;
  messageType: string;
  message: {
    conversation: string;
  };
  messageTimestamp: number;
  instanceId: string;
  source: string;
  contextInfo: {
    expiration?: number;
    disappearingMode?: {
      initiator: string;
    };
  } | null;
  MessageUpdate?: Array<{
    status: string;
  }>;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatWhatsappDisplayNumber(remoteJid: string | undefined): string {
  if (!remoteJid) return "";
  const base = remoteJid.replace(/@s\.whatsapp\.net$/i, "");
  if (!base) return "";
  return /^\d+$/.test(base) ? `+${base}` : base;
}

function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const searchLower = searchQuery.toLowerCase();
    const name = conversation.pushName?.toLowerCase() || "";
    const phone = conversation.remoteJid.toLowerCase();
    return name.includes(searchLower) || phone.includes(searchLower);
  });

  // Función para cargar los mensajes de una conversación
  const loadMessages = async (remoteJid: string) => {
    try {
      console.log("Cargando mensajes para:", remoteJid);
      const messagesData = await getMessages(remoteJid);
      console.log("Respuesta de mensajes:", messagesData);

      if (messagesData.messages && messagesData.messages.records) {
        // Ordenar mensajes por timestamp de más reciente a más antiguo
        const sortedMessages = [...messagesData.messages.records].sort(
          (a, b) => b.messageTimestamp - a.messageTimestamp,
        );
        setMessages(sortedMessages);
      } else {
        setError("No se encontraron mensajes para esta conversación");
      }
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
      setError("Error al cargar los mensajes");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener todas las conversaciones
        const conversationsData = await getConversations();
        console.log("Conversaciones obtenidas:", conversationsData);
        setConversations(conversationsData);

        // Si hay conversaciones, seleccionar la primera por defecto
        if (conversationsData.length > 0) {
          setSelectedConversation(conversationsData[0]);
          await loadMessages(conversationsData[0].remoteJid);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Error al cargar los datos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar el cambio de conversación seleccionada
  const handleConversationSelect = async (conversation: Conversation) => {
    console.log("Seleccionando conversación:", conversation);
    setSelectedConversation(conversation);
    await loadMessages(conversation.remoteJid);
  };

  const handleDeleteConversation = async (
    conversationToDelete: Conversation,
  ) => {
    try {
      setIsDeleting(true);
      // Eliminar todos los mensajes de la conversación
      for (const message of messages) {
        if (message.key.fromMe) {
          await deleteMessage(
            message.key.id,
            message.key.remoteJid,
            message.key.fromMe,
          );
        }
      }
      // Actualizar la lista de conversaciones
      const updatedConversations = await getConversations();
      setConversations(updatedConversations);
      setConversationToDelete(null);

      // Si la conversación eliminada era la seleccionada, seleccionar la primera disponible
      if (selectedConversation?.id === conversationToDelete.id) {
        if (updatedConversations.length > 0) {
          setSelectedConversation(updatedConversations[0]);
          await loadMessages(updatedConversations[0].remoteJid);
        } else {
          setSelectedConversation(null);
          setMessages([]);
        }
      }

      toast.success("Conversación eliminada exitosamente ✅", {
        description:
          "La conversación ha sido eliminada. Los mensajes desaparecerán del chat una vez que WhatsApp confirme la operación.",
      });
    } catch (error) {
      console.error("Error al eliminar la conversación:", error);
      toast.error("Error al eliminar la conversación ❌", {
        description:
          "No se pudo eliminar la conversación. Por favor, inténtalo de nuevo.",
      });
      setError("Error al eliminar la conversación");
    } finally {
      setIsDeleting(false);
    }
  };

  const profilePhoneDisplay = formatWhatsappDisplayNumber(
    selectedConversation?.remoteJid,
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Cargando conversación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/dashboard/conversations">
            <Button variant="outline">Volver a conversaciones</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
            <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Container - Conversations List */}
                <Card className="md:col-span-3 shadow-sm">
                  <CardHeader>
                    <CardTitle>Conversaciones</CardTitle>
                    <CardDescription>Lista de conversaciones disponibles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Search className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Buscar conversación..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1868db] focus:border-transparent"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <ScrollArea className="h-[650px]">
                      <div className="space-y-2">
                        {filteredConversations.map((conversation) => (
                          <button
                            key={conversation.id}
                            onClick={() => handleConversationSelect(conversation)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 ${
                              selectedConversation?.id === conversation.id ? "bg-gray-100" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {conversation.profilePicUrl ? (
                                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                                  <Image
                                    src={conversation.profilePicUrl}
                                    alt={conversation.pushName || "Contacto"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1868db] text-white text-xs font-medium">
                                  {getInitials(conversation.pushName)}
                                </div>
                              )}
                              <div className="flex flex-col items-start justify-center">
                                <p className="text-xs font-medium">
                                  {conversation.pushName || "Sin nombre"}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                  {conversation.remoteJid.replace('@s.whatsapp.net', '')}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-center gap-0.5">
                              <p className="text-[10px] text-gray-500">
                                {format(new Date(conversation.createdAt), "HH:mm a", { locale: es })}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                {format(new Date(conversation.createdAt), "dd/MM/yyyy", { locale: es })}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Middle Container - Messages */}
                <Card className="md:col-span-6 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <CardTitle>Mensajes</CardTitle>
                        <CardDescription>Historial de mensajes de la conversación de WhatsApp</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[650px] rounded-md border p-4">
                      {messages.length > 0 ? (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-2 ${message.key.fromMe ? "justify-end" : "justify-start"}`}
                            >
                              {!message.key.fromMe && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden">
                                  {selectedConversation?.profilePicUrl ? (
                                    <Image
                                      src={selectedConversation.profilePicUrl}
                                      alt={selectedConversation.pushName || "Contacto"}
                                      width={32}
                                      height={32}
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1868db] text-white font-medium text-sm">
                                      {getInitials(selectedConversation?.pushName || null)}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  message.key.fromMe
                                    ? "bg-[#1868db] text-white"
                                    : "bg-[#f3f4f6] text-gray-900"
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.message.conversation}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  <p className="text-xs opacity-70">
                                    {format(new Date(message.messageTimestamp * 1000), "HH:mm", {
                                      locale: es,
                                    })}
                                  </p>
                                  {message.key.fromMe && message.MessageUpdate && (
                                    <span className="text-xs opacity-70">
                                      {message.MessageUpdate.some(update => update.status === "READ") ? (
                                        <span title="Leído">✓✓</span>
                                      ) : message.MessageUpdate.some(update => update.status === "DELIVERY_ACK") ? (
                                        <span title="Entregado">✓✓</span>
                                      ) : (
                                        <span title="Enviado">✓</span>
                                      )}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {message.key.fromMe && (
                                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
                                  <Image
                                    src="/avatar.png"
                                    alt="Agent avatar"
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No hay mensajes en esta conversación
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Right Container - Contact Info */}
                <Card className="md:col-span-3 shadow-sm h-fit">
                  <CardHeader>
                    <CardTitle>Perfil del contacto</CardTitle>
                    <CardDescription>Información personal del contacto</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="mb-2 flex justify-center">
                        {selectedConversation?.profilePicUrl ? (
                          <div className="relative h-32 w-32 overflow-hidden rounded-full">
                            <Image
                              src={selectedConversation.profilePicUrl}
                              alt={selectedConversation.pushName || "Contacto"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#1868db] text-4xl font-medium text-white">
                            {getInitials(
                              selectedConversation?.pushName || null,
                            )}
                          </div>
                        )}
                      </div>

                      <InputWithIcon
                        icon={User}
                        label="Nombre"
                        readOnly
                        value={selectedConversation?.pushName?.trim() ?? ""}
                        hint={
                          !selectedConversation?.pushName?.trim()
                            ? "Sin nombre"
                            : undefined
                        }
                        placeholder=""
                        className={cn(
                          AUTH_INPUT_FIELD_CLASS,
                          "cursor-default bg-muted/30",
                        )}
                      />
                      <InputWithIcon
                        icon={Phone}
                        label="Número"
                        type="tel"
                        readOnly
                        value={profilePhoneDisplay}
                        hint={
                          !profilePhoneDisplay ? "Sin número" : undefined
                        }
                        placeholder=""
                        className={cn(
                          AUTH_INPUT_FIELD_CLASS,
                          "cursor-default bg-muted/30 tabular-nums",
                        )}
                      />
                      <InputWithIcon
                        icon={Calendar}
                        label="Creado"
                        readOnly
                        value={
                          selectedConversation?.createdAt
                            ? format(
                                new Date(selectedConversation.createdAt),
                                "PPP",
                                { locale: es },
                              )
                            : ""
                        }
                        hint={
                          !selectedConversation?.createdAt
                            ? "No disponible"
                            : undefined
                        }
                        placeholder=""
                        className={cn(
                          AUTH_INPUT_FIELD_CLASS,
                          "cursor-default bg-muted/30",
                        )}
                      />
                      <InputWithIcon
                        icon={Clock}
                        label="Última actualización"
                        readOnly
                        value={
                          selectedConversation?.updatedAt
                            ? format(
                                new Date(selectedConversation.updatedAt),
                                "PPP",
                                { locale: es },
                              )
                            : ""
                        }
                        hint={
                          !selectedConversation?.updatedAt
                            ? "No disponible"
                            : undefined
                        }
                        placeholder=""
                        className={cn(
                          AUTH_INPUT_FIELD_CLASS,
                          "cursor-default bg-muted/30",
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
      {/* Delete Conversation Dialog */}
      <Dialog
        open={!!conversationToDelete}
        onOpenChange={() => setConversationToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta conversación? Esta
              acción eliminará todos los mensajes y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConversationToDelete(null)}
              disabled={isDeleting}
              className="border-[#1868db] text-[#1868db] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#1868db] hover:text-white transition-all duration-200 group"
            >
              <X className="h-4 w-4 mr-2 text-[#1868db] group-hover:text-white transition-colors" />
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                conversationToDelete &&
                handleDeleteConversation(conversationToDelete)
              }
              disabled={isDeleting}
              className="bg-[#1868db] text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#1458c4] hover:text-white transition-all duration-200"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ConversationsPage;
