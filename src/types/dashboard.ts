export interface Metric {
  id: string
  title: string
  value: string
  subtitle: string
  icon: string
  color: string
  trend: 'up' | 'down'
  created_at: string
}

export interface Conversation {
  id: string
  name: string
  message: string
  time: string
  avatar: string
  is_active: boolean
  created_at: string
}

export interface Client {
  id: string
  name: string
  type: 'Telefónico' | 'Whatsapp' | 'CRM'
  avatar: string
  type_color: string
  created_at: string
}

export interface FAQ {
  id: string
  title: string
  percentage: string
  created_at: string
}

export interface DashboardStats {
  start_date: string
  end_date: string
  average_time: string
  target_time: string
} 