"use client"

import { Phone, Calendar, Clock, User, Bot, Download } from "lucide-react"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface Message {
  speaker: "agent" | "customer"
  text: string
}

interface Action {
  type: string
  details: string
}

interface Conversation {
  id: string
  customer: {
    name: string
    phone: string
  }
  agent: string
  channel: string
  date: string
  time: string
  duration: string
  intent: string
  status: string
  audioUrl?: string
  transcript: Message[]
  summary: string
  actions: Action[]
}

interface ConversationDetailsProps {
  conversationId: string
  conversation?: Conversation
}

export function ConversationDetails({ conversationId, conversation }: ConversationDetailsProps) {
  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="">Cargando detalles de la conversación {conversationId}...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Detalles de la conversación #{conversationId}</h2>
          <Button variant="outline" size="sm" className="gap-1">
            <Download size={16} />
            Exportar
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex flex-col">
            <span className="text-xs ">Cliente</span>
            <span className="font-medium">{conversation.customer.name}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs ">Fecha</span>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{conversation.date}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs ">Hora</span>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{conversation.time}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs ">Duración</span>
            <span>{conversation.duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Phone size={12} /> Teléfono
          </Badge>
          <Badge
            variant="outline"
            className={
              conversation.intent === "appointment"
                ? "bg-green-50"
                : conversation.intent === "complaint"
                  ? "bg-red-50"
                  : "bg-blue-50"
            }
          >
            {conversation.intent === "appointment"
              ? "Agendamiento"
              : conversation.intent === "complaint"
                ? "Queja"
                : "Información"}
          </Badge>
          <Badge variant="outline" className="bg-emerald-50">
            {conversation.status === "completed" ? "Completada" : "En proceso"}
          </Badge>
        </div>
      </div>

      {conversation.audioUrl && (
        <AudioPlayer src={conversation.audioUrl} title="Grabación de la llamada" className="mb-4" />
      )}

      <Tabs defaultValue="transcript" className="flex-1">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="transcript">Transcripción</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="actions">Acciones</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="flex-1 mt-4">
          <ScrollArea className="h-[500px] rounded-md border p-4">
            <div className="space-y-4">
              {conversation.transcript.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 ${message.speaker === "agent" ? "justify-start" : "justify-end"}`}
                >
                  {message.speaker === "agent" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Bot size={16} className="text-primary" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.speaker === "agent" ? "bg-muted" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  {message.speaker === "customer" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <User size={16} className="text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2">Resumen de la conversación</h3>
            <p className="text-sm ">{conversation.summary}</p>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="mt-4">
          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2">Acciones realizadas</h3>
            <div className="space-y-2">
              {conversation.actions.map((action, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    {action.type === "appointment_scheduled" ? (
                      <Calendar size={14} className="text-primary" />
                    ) : (
                      <Phone size={14} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {action.type === "appointment_scheduled" ? "Cita agendada" : "Notificación enviada"}
                    </p>
                    <p className="">{action.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 