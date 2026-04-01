import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Une varias refs (p. ej. RHF + ref interna) para un mismo elemento DOM */
export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (ref == null) return
      if (typeof ref === "function") {
        ref(node)
      } else {
        ;(ref as React.MutableRefObject<T | null>).current = node
      }
    })
  }
}

// Utilidades para traducción de estados
export const APPOINTMENT_STATUS_TRANSLATIONS = {
  UNASSIGNED: "Sin asignar",
  CONFIRMED: "Confirmada", 
  RESERVED: "Reservada",
  CANCELLED: "Cancelada"
} as const

export type AppointmentStatus = keyof typeof APPOINTMENT_STATUS_TRANSLATIONS

// Función para traducir estado de cita
export function translateAppointmentStatus(status: string): string {
  const upperStatus = status.toUpperCase() as AppointmentStatus
  return APPOINTMENT_STATUS_TRANSLATIONS[upperStatus] || status
}

// Función para obtener el color del estado
export function getStatusColor(status: string): string {
  const upperStatus = status.toUpperCase() as AppointmentStatus
  switch (upperStatus) {
    case "CONFIRMED":
      return "text-green-800"
    case "RESERVED":
      return "text-blue-800"
    case "CANCELLED":
      return "text-red-800"
    case "UNASSIGNED":
    default:
      return "text-gray-800"
  }
}

// Función para capitalizar primera letra
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

// Función para formatear fecha en español
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Función para formatear hora en español
export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Función para validar formato de teléfono
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/
  return phoneRegex.test(phone)
}

// Función para limpiar número de teléfono
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '')
}
