"use client"

import { useState } from "react"
import { Search, Phone, MessageSquare, Calendar, AlertCircle } from "lucide-react"
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon"
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "Juan Pérez",
    channel: "phone",
    timestamp: "2023-05-01T10:30:00",
    intent: "appointment",
    snippet: "Quería saber si tienen citas disponibles esta semana para una limpieza dental.",
    hasAudio: true,
  },
  {
    id: "2",
    name: "María González",
    channel: "whatsapp",
    timestamp: "2023-05-01T11:45:00",
    intent: "info",
    snippet: "¿Cuáles son sus horarios de atención?",
    hasAudio: false,
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    channel: "phone",
    timestamp: "2023-05-01T14:20:00",
    intent: "complaint",
    snippet: "Tengo un problema con mi última factura.",
    hasAudio: true,
  },
  {
    id: "4",
    name: "Ana Martínez",
    channel: "webchat",
    timestamp: "2023-05-01T16:05:00",
    intent: "appointment",
    snippet: "Necesito cambiar mi cita del jueves.",
    hasAudio: false,
  },
  {
    id: "5",
    name: "Roberto Sánchez",
    channel: "phone",
    timestamp: "2023-05-02T09:15:00",
    intent: "info",
    snippet: "¿Cuánto cuesta una consulta general?",
    hasAudio: true,
  },
]

interface ConversationListProps {
  onSelectConversation: (id: string) => void
  selectedConversation: string | null
}

export function ConversationList({ onSelectConversation, selectedConversation }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.snippet.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case "appointment":
        return <Calendar size={16} className="text-green-500" />
      case "info":
        return <MessageSquare size={16} className="text-blue-500" />
      case "complaint":
        return <AlertCircle size={16} className="text-red-500" />
      default:
        return <MessageSquare size={16} />
    }
  }

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case "phone":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Phone size={12} /> Teléfono
          </Badge>
        )
      case "whatsapp":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
            <MessageSquare size={12} /> WhatsApp
          </Badge>
        )
      case "webchat":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-blue-50">
            <MessageSquare size={12} /> Web Chat
          </Badge>
        )
      default:
        return <Badge variant="outline">{channel}</Badge>
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Conversaciones</h2>
        <InputWithIcon
          icon={Search}
          placeholder="Buscar conversaciones..."
          className={AUTH_INPUT_FIELD_CLASS}
          value={searchQuery}
          onChange={(v) => setSearchQuery(v)}
          aria-label="Buscar conversaciones"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "cursor-pointer rounded-md border p-3 transition-colors hover:bg-muted/50",
                  selectedConversation === conversation.id && "bg-muted",
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="font-medium">{conversation.name}</div>
                  <div className="text-xs ">{formatDate(conversation.timestamp)}</div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {getChannelBadge(conversation.channel)}
                  {conversation.hasAudio && (
                    <Badge variant="secondary" className="text-xs">
                      Audio
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex items-start gap-1">
                  {getIntentIcon(conversation.intent)}
                  <p className="text-sm  line-clamp-2">{conversation.snippet}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center ">No se encontraron conversaciones</div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 