import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const passwordField = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(128, "Máximo 128 caracteres")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/,
    "Debe incluir mayúscula, minúscula, un número y un carácter especial",
  );

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "Máximo 50 caracteres"),
    paternalSurname: z
      .string()
      .min(2, "El apellido paterno debe tener al menos 2 caracteres")
      .max(50, "Máximo 50 caracteres"),
    maternalSurname: z
      .string()
      .max(50, "Máximo 50 caracteres")
      .optional(),
    email: z
      .string()
      .trim()
      .max(254, "Máximo 254 caracteres")
      .email("Por favor ingresa un correo electrónico válido"),
    phone: z
      .string()
      .min(1, "Ingresa tu teléfono")
      .refine(
        (val) => parsePhoneNumberFromString(val)?.isValid() === true,
        "El número de teléfono no es válido para este país",
      ),
    password: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
