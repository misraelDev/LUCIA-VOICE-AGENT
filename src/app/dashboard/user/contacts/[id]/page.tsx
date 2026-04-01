"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getContactById, type Contact } from "@/services/ContactService";
import { getCallsByContactId, type Call } from "@/services/CallService";
import {
  appointmentService,
  type Appointment,
} from "@/services/AppointmentService";
import {
  Phone,
  Calendar,
  User,
  Mail,
  Loader2,
  MessageSquare,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon";
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Helper functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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

interface Message {
  role: "bot" | "user";
  message: string;
  time: number;
}

function ContactDetailsPage() {
  const params = useParams();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("conversation");
  const [lastCall, setLastCall] = useState<Call | null>(null);
  const [parsedMessages, setParsedMessages] = useState<Message[]>([]);
  const [loadingCall, setLoadingCall] = useState(false);
  const [callHistory, setCallHistory] = useState<Call[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(false);

  const fetchContact = useCallback(async () => {
    if (!params.id) return;

    setLoading(true);
    try {
      const response = await getContactById(Number(params.id));
      if (response.success && response.contact) {
        setContact(response.contact);
      } else {
        throw new Error(response.error || "No se pudo obtener el contacto");
      }
    } catch (error) {
      console.error("Error al cargar el contacto:", error);
      toast.error("Error al cargar el contacto", {
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado",
      });
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const fetchLastCall = useCallback(async () => {
    if (!params.id) return;

    setLoadingCall(true);
    try {
      const response = await getCallsByContactId(Number(params.id));
      if (response.success && response.calls && response.calls.length > 0) {
        const sorted = [...response.calls].sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : 0;
          const db = b.date ? new Date(b.date).getTime() : 0;
          return db - da;
        });
        const latest = sorted[0];
        setLastCall(latest);
        if (latest.messages) {
          try {
            const messages = parseMessages(latest.messages);
            setParsedMessages(messages);
          } catch {
            setParsedMessages([]);
          }
        }
      } else {
        setLastCall(null);
        setParsedMessages([]);
      }
    } catch (error) {
      console.error("Error al cargar la transcripción:", error);
      toast.error("Error al cargar la transcripción");
    } finally {
      setLoadingCall(false);
    }
  }, [params.id]);

  const fetchCallHistory = useCallback(async () => {
    if (!params.id) return;

    setLoadingHistory(true);
    try {
      const response = await getCallsByContactId(Number(params.id));
      if (response.success && response.calls) {
        setCallHistory(response.calls);
      } else {
        setCallHistory([]);
      }
    } catch (error) {
      console.error("Error al cargar el historial de llamadas:", error);
      toast.error("Error al cargar el historial de llamadas");
    } finally {
      setLoadingHistory(false);
    }
  }, [params.id]);

  const fetchAppointments = useCallback(async (phone?: number | null) => {
    if (!phone) return;

    setLoadingAppointments(true);
    try {
      const response = await appointmentService.getAppointmentsByContactPhone(
        String(phone),
      );
      if (response.success && response.appointments) {
        setAppointments(response.appointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error al cargar el historial de citas:", error);
      toast.error("Error al cargar el historial de citas");
    } finally {
      setLoadingAppointments(false);
    }
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchContact();
      fetchLastCall();
      fetchCallHistory();
    }
  }, [params.id, fetchContact, fetchLastCall, fetchCallHistory]);

  useEffect(() => {
    if (contact?.phone_number) {
      fetchAppointments(contact.phone_number);
    }
  }, [contact?.phone_number, fetchAppointments]);

  const parseMessages = (messagesStr: string): Message[] => {
    try {
      const unescaped = messagesStr.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      const messageRegex =
        /"role":"(bot|user)","message":"([^"]+)","time":(\d+)/g;
      const matches = [...unescaped.matchAll(messageRegex)];

      return matches.map((match) => ({
        role: match[1] as "bot" | "user",
        message: match[2].replace(/\\n/g, "\n"),
        time: Number.parseInt(match[3]),
      }));
    } catch {
      return [];
    }
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "Duración desconocida";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes} min ${remainingSeconds} seg`;
  };

  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return "Fecha no especificada";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadoBadge = (estado: string | null) => {
    if (!estado) return null;

    const estadoConfig = {
      reservada: {
        variant: "default",
        className: "bg-blue-100 text-blue-800 border border-blue-200",
        text: "Reservada",
      },
      confirmada: {
        variant: "default",
        className: "bg-green-100 text-green-800 border border-green-200",
        text: "Confirmada",
      },
      cancelada: {
        variant: "destructive",
        className: "bg-red-100 text-red-800 border border-red-200",
        text: "Cancelada",
      },
      "sin asignar": {
        variant: "outline",
        className: "bg-gray-100 text-gray-800 border border-gray-200",
        text: "Sin asignar",
      },
    };

    const config = estadoConfig[
      estado.toLowerCase() as keyof typeof estadoConfig
    ] || {
      variant: "outline",
      className: "bg-gray-100 text-gray-800 border border-gray-200",
      text: estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase(),
    };

    return (
      <Badge
        variant={
          config.variant as "default" | "secondary" | "destructive" | "outline"
        }
        className={config.className}
      >
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="text-center space-y-4">
          <p className="">Cargando información del contacto...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="text-center space-y-4">
          <p className="">No se encontró información del contacto</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Contact Details Content */}
      <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Details - Left Container */}
          <Card className="lg:col-span-1 shadow-sm h-fit">
            <CardHeader>
              <CardTitle>Información del contacto</CardTitle>
              <CardDescription>
                Detalles completos del contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <InputWithIcon
                  icon={User}
                  label="Nombre"
                  readOnly
                  value={(contact.name ?? "").trim()}
                  placeholder="Nombre completo"
                  hint={!contact.name?.trim() ? "Sin nombre" : undefined}
                  className={cn(
                    AUTH_INPUT_FIELD_CLASS,
                    "cursor-default bg-muted/30",
                  )}
                />
                <InputWithIcon
                  icon={Mail}
                  label="Correo electrónico"
                  type="email"
                  readOnly
                  value={(contact.email ?? "").trim()}
                  placeholder="ejemplo@correo.com"
                  hint={!contact.email?.trim() ? "Sin email" : undefined}
                  className={cn(
                    AUTH_INPUT_FIELD_CLASS,
                    "cursor-default bg-muted/30 break-all",
                  )}
                />
                <InputWithIcon
                  icon={Phone}
                  label="Teléfono"
                  type="tel"
                  readOnly
                  value={
                    contact.phone_number != null
                      ? `+${contact.phone_number}`
                      : ""
                  }
                  placeholder="Número de teléfono"
                  hint={
                    contact.phone_number == null ? "Sin teléfono" : undefined
                  }
                  className={cn(
                    AUTH_INPUT_FIELD_CLASS,
                    "cursor-default bg-muted/30 tabular-nums",
                  )}
                />
              </div>
              <InputWithIcon
                icon={Calendar}
                label="Fecha de creación"
                readOnly
                value={
                  contact.creation_date
                    ? formatDate(contact.creation_date)
                    : ""
                }
                hint={!contact.creation_date ? "N/A" : undefined}
                placeholder=""
                className={cn(
                  AUTH_INPUT_FIELD_CLASS,
                  "cursor-default bg-muted/30",
                )}
              />
            </CardContent>
          </Card>

          {/* Right Container with Tabs */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Interacciones</CardTitle>
                <CardDescription>
                  Historial de interacciones con el contacto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="w-full flex flex-wrap justify-start gap-4 md:gap-10 border-b border-[#dfe4ea] p-0 bg-transparent">
                    <TabsTrigger
                      value="conversation"
                      className="flex items-center gap-2 px-0 py-[15px] text-sm font-medium text-[#637381] border-b-2 border-transparent data-[state=active]:border-[#1868db] data-[state=active]:text-[#1868db] hover:text-[#1868db] transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Última conversación
                    </TabsTrigger>
                    <TabsTrigger
                      value="calls"
                      className="flex items-center gap-2 px-0 py-[15px] text-sm font-medium text-[#637381] border-b-2 border-transparent data-[state=active]:border-[#1868db] data-[state=active]:text-[#1868db] hover:text-[#1868db] transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                      Historial de llamadas
                    </TabsTrigger>
                    <TabsTrigger
                      value="appointments"
                      className="flex items-center gap-2 px-0 py-[15px] text-sm font-medium text-[#637381] border-b-2 border-transparent data-[state=active]:border-[#1868db] data-[state=active]:text-[#1868db] hover:text-[#1868db] transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      Citas programadas
                    </TabsTrigger>
                  </TabsList>

                  {/* Última conversación */}
                  <TabsContent value="conversation" className="mt-4">
                    {loadingCall ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#1868db]" />
                        <p className="">Cargando transcripción...</p>
                      </div>
                    ) : lastCall ? (
                      <Card className="shadow-sm">
                        <CardHeader>
                          <CardTitle>Transcripción</CardTitle>
                          <CardDescription>
                            {lastCall.date
                              ? `Conversación del ${new Date(lastCall.date).toLocaleDateString()}`
                              : "Conversación completa entre el asistente y el cliente"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {parsedMessages.length > 0 ? (
                            <ScrollArea className="h-[400px] md:h-[500px] lg:h-[600px] rounded-md border p-4">
                              <div className="space-y-4">
                                {parsedMessages.map((message, index) => (
                                  <div
                                    key={index}
                                    className={`flex gap-2 ${message.role === "bot" ? "justify-start" : "justify-end"}`}
                                  >
                                    {message.role === "bot" && (
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
                                    <div
                                      className={`rounded-lg px-3 py-2 sm:px-4 max-w-[90%] sm:max-w-[80%] ${
                                        message.role === "bot"
                                          ? "bg-[#1868db] text-white"
                                          : "bg-[#f3f4f6] text-gray-900"
                                      }`}
                                    >
                                      <p className="text-sm">
                                        {message.message}
                                      </p>
                                    </div>
                                    {message.role === "user" && (
                                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1868db] text-white font-medium text-sm">
                                        {getInitials(contact.name)}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          ) : (
                            <div className="text-center py-8">
                              <p className="">
                                No hay transcripción disponible para esta
                                conversación
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12  mx-auto mb-4" />
                        <p className="">
                          No hay conversaciones registradas con este contacto
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Historial de llamadas */}
                  <TabsContent value="calls" className="mt-4">
                    {loadingHistory ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#1868db]" />
                        <p className="">Cargando historial de llamadas...</p>
                      </div>
                    ) : callHistory.length > 0 ? (
                      <div className="space-y-4">
                        {callHistory.map((call) => (
                          <Card key={call.id} className="shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 ">
                                      <span>
                                        {call.date
                                          ? new Date(
                                              call.date,
                                            ).toLocaleDateString()
                                          : "Fecha desconocida"}
                                      </span>
                                      <span>•</span>
                                      <span>
                                        {formatDuration(call.duration)}
                                      </span>
                                    </div>
                                    {call.motive && (
                                      <div className="mt-1">
                                        <Badge
                                          variant="outline"
                                          className="bg-emerald-50 whitespace-normal text-left max-w-[700px]"
                                        >
                                          {call.motive}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {call.messages && (
                                <div className="mt-4 pt-4 border-t">
                                  <p className="text-sm  whitespace-pre-wrap">
                                    {call.messages}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Phone className="h-12 w-12  mx-auto mb-4" />
                        <p className="">
                          No hay historial de llamadas disponible
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Citas programadas */}
                  <TabsContent value="appointments" className="mt-4">
                    {loadingAppointments ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#1868db]" />
                        <p className="">Cargando historial de citas...</p>
                      </div>
                    ) : appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <Card key={appointment.id} className="shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 ">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {formatDateTime(appointment.date)}
                                      </span>
                                      {appointment.date && (
                                        <>
                                          <span>•</span>
                                          <span>
                                            Duración:{" "}
                                            {(() => {
                                              if (!appointment.date)
                                                return "No especificada";
                                              const start = new Date(
                                                appointment.date,
                                              );
                                              const end = new Date(
                                                appointment.date,
                                              );
                                              const diff = Math.round(
                                                (end.getTime() -
                                                  start.getTime()) /
                                                  (1000 * 60),
                                              );
                                              return `${diff} minutos`;
                                            })()}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    {appointment.status && (
                                      <div className="mt-1">
                                        <p className="text-sm font-medium">
                                          {appointment.status}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  {getEstadoBadge(appointment.status)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12  mx-auto mb-4" />
                        <p className="">No hay citas programadas</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </>
  );
}

export default ContactDetailsPage;
