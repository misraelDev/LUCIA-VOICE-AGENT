"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCallDetails, type Call } from "@/services/user/CallService";
import {
  getContactById,
  type Contact,
} from "@/services/ContactService";
import { Phone, Calendar, User, Bot, Clock, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon";
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "bot" | "user";
  message: string;
  time: number;
}

function CallDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedMessages, setParsedMessages] = useState<Message[]>([]);
  const [relatedContact, setRelatedContact] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        setLoading(true);
        const response = await getCallDetails(id);
        if (response.success && response.call) {
          setCall(response.call);
          if (response.call.messages) {
            try {
              const messages = parseMessages(response.call.messages);
              setParsedMessages(messages);
            } catch {
              setParsedMessages([]);
            }
          }
        } else {
          setError(
            response.error || "No se encontraron detalles de la llamada",
          );
        }
      } catch {
        setError("Error al cargar los detalles de la llamada");
      } finally {
        setLoading(false);
      }
    };

    fetchCallDetails();
  }, [id]);

  useEffect(() => {
    const cid = call?.contact_id;
    if (cid == null || !Number.isFinite(cid)) {
      setRelatedContact(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const r = await getContactById(cid);
      if (!cancelled && r.success && r.contact) {
        setRelatedContact(r.contact);
      } else if (!cancelled) {
        setRelatedContact(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [call?.contact_id]);

  const parseMessages = (messagesStr: string): Message[] => {
    try {
      const unescaped = messagesStr.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      const messageRegex =
        /"role":"(bot|user)","message":"([^"]+)","time":(\d+)/g;
      const matches = [...unescaped.matchAll(messageRegex)];

      return matches.map((match) => ({
        role: match[1] as "bot" | "user",
        message: match[2].replace(/\\n/g, "\n"),
        time: parseInt(match[3]),
      }));
    } catch {
      return [];
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes} minutos, ${remainingSeconds} segundos`;
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="text-center space-y-4">
          <p className="">Cargando detalles de la llamada...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-center space-y-4">
            <Phone className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-900">
              Error al cargar la llamada
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {call && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 ">
                  <span>{new Date(call.date || "").toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{formatDuration(call.duration || 0)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-50 whitespace-normal text-left max-w-[700px]"
              >
                {call.motive ?? "No hay un motivo definido"}
              </Badge>
              {call.intent && (
                <Badge variant="secondary">
                  {call.intent}
                  {call.confidence != null && Number.isFinite(call.confidence) ? (
                    <span className="ml-1 text-xs opacity-70">
                      ({(call.confidence * 100).toFixed(0)}%)
                    </span>
                  ) : null}
                </Badge>
              )}
            </div>
          </div>

          {call.contact_id != null && Number.isFinite(call.contact_id) ? (
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="flex flex-col gap-4 space-y-0 pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5">
                  <CardTitle className="text-lg">
                    Información del contacto
                  </CardTitle>
                  <CardDescription>
                    Detalles completos del contacto
                  </CardDescription>
                  <p className="text-xs text-muted-foreground">
                    Contacto n.º {call.contact_id}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 border-[#1868db] text-[#1868db] hover:bg-[#1868db] hover:text-white w-full sm:w-auto"
                  asChild
                >
                  <Link href={`/dashboard/user/contacts/${call.contact_id}`}>
                    Ver ficha del contacto
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                  <InputWithIcon
                    icon={User}
                    label="Nombre"
                    readOnly
                    value={
                      relatedContact?.name?.trim() ??
                      call.contactName?.trim() ??
                      ""
                    }
                    hint={
                      !relatedContact?.name?.trim() &&
                      !call.contactName?.trim()
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
                    icon={Mail}
                    label="Correo electrónico"
                    type="email"
                    readOnly
                    value={relatedContact?.email?.trim() ?? ""}
                    hint={
                      !relatedContact?.email?.trim() ? "Sin email" : undefined
                    }
                    placeholder=""
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
                      relatedContact?.phone_number != null
                        ? `+${relatedContact.phone_number}`
                        : ""
                    }
                    hint={
                      relatedContact?.phone_number == null
                        ? "Sin teléfono"
                        : undefined
                    }
                    placeholder=""
                    className={cn(
                      AUTH_INPUT_FIELD_CLASS,
                      "cursor-default bg-muted/30 tabular-nums",
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detalles */}
            <Card className="lg:col-span-1 shadow-sm">
              <CardHeader>
                <CardTitle>Información de la llamada</CardTitle>
                <CardDescription>
                  Detalles completos de la llamada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Calendar size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium ">Fecha y hora</p>
                      <p className="text-base">
                        {new Date(call.date || "").toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Clock size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium ">Duración</p>
                      <p className="text-base">
                        {formatDuration(call.duration || 0)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium ">Resumen</p>
                      {call.summary ? (
                        <p className="text-base whitespace-pre-wrap max-w-[500px]">
                          {call.summary}
                        </p>
                      ) : (
                        <p className="text-base ">
                          No hay un resumen disponible para la llamada
                        </p>
                      )}
                    </div>
                  </div>

                  {call.actions && call.actions.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">
                        Acciones realizadas
                      </h3>
                      <div className="space-y-2">
                        {call.actions.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                              <Calendar size={14} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{action.type}</p>
                              <p className="">{action.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Transcripción */}
            <Card className="lg:col-span-2 flex flex-col shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Transcripción de la llamada</CardTitle>
                <CardDescription>
                  Conversación completa entre el asistente y el cliente
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-0 p-2">
                {parsedMessages.length > 0 ? (
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <div className="space-y-3">
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
                            className={`rounded-lg px-4 py-2 max-w-[80%] ${
                              message.role === "bot"
                                ? "bg-[#1868db] text-white"
                                : "bg-[#f3f4f6] text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                          </div>
                          {message.role === "user" && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1868db]">
                              <User size={16} className="text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8">
                    <p className="">
                      No hay transcripción disponible para esta llamada
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Audio Section */}
          <Card className="col-span-full shadow-sm">
            <CardHeader>
              <CardTitle>Audios de la llamada</CardTitle>
              <CardDescription>
                Escucha la grabación de la conversación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {call.audioCombined && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Audio Completo</h3>
                      <p className="text-sm ">Conversación completa</p>
                    </div>
                  </div>
                  <audio controls className="w-full" src={call.audioCombined} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {call.audioAssistant && (
                  <div className="p-4 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-blue-800">
                        Audio del Asistente
                      </h3>
                    </div>
                    <audio
                      controls
                      className="w-full"
                      src={call.audioAssistant}
                    />
                  </div>
                )}

                {call.audioCustomer && (
                  <div className="p-4 rounded-lg bg-purple-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-purple-800">
                        Audio del Cliente
                      </h3>
                    </div>
                    <audio
                      controls
                      className="w-full"
                      src={call.audioCustomer}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default CallDetailsPage;
