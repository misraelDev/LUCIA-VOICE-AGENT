export interface Message {
  role: "bot" | "user"
  message: string
  time: number
}

export interface Action {
  type: string
  details: string
}

export interface Call {
  id?: number
  call_id: string
  created_at?: string
  date?: string | null
  duration: number | null
  status?: string | null
  phone_number?: string
  motive?: string | null
  intent?: string | null
  confidence?: number | null
  messages?: string | null
  summary?: string | null
  successEvaluation?: string | null
  actions?: Action[]
  audio_combined?: string | null // URL del audio combinado
  audio_asistant?: string | null // URL del audio del asistente
  audio_customer?: string | null // URL del audio del cliente
  client?: number
  client_name?: string | null
} 