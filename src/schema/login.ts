import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, "Máximo 254 caracteres")
    .email("Por favor ingresa un correo electrónico válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(128, "Máximo 128 caracteres"),
})

export type LoginFormData = z.infer<typeof loginSchema>