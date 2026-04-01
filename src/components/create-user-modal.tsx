"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  User,
  Lock,
  Loader2,
  X,
  Mail,
  Shield,
  Save,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon";
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles";
import { toast } from "sonner";
import { userService, type CreateUserRequest } from "@/services/UserService";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

/** Misma regla que {@code UserRequestDTO} en el API. */
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

const userFormSchema = z
  .object({
  email: z.string().email("El email no es válido").min(1, "El email es obligatorio"),
  password: z
    .string()
    .min(8, "La contraseña debe tener entre 8 y 128 caracteres")
    .max(128, "La contraseña debe tener entre 8 y 128 caracteres")
    .regex(
      PASSWORD_REGEX,
      "Incluye mayúscula, minúscula, un número y un carácter especial",
    ),
  confirmPassword: z.string().min(1, "Confirma la contraseña"),
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  paternalSurname: z
    .string()
    .min(2, "El apellido paterno debe tener al menos 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  maternalSurname: z.string().max(50, "Máximo 50 caracteres").optional(),
  phone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .max(32, "Máximo 32 caracteres"),
  role: z.enum(["user", "seller", "admin"]),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userFormSchema>;

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
}: CreateUserModalProps) {
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const defaultValues: UserFormValues = {
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    paternalSurname: "",
    maternalSurname: "",
    phone: "",
    role: "user",
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    mode: "onChange",
    defaultValues,
  });

  const resetForm = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
    form.reset(defaultValues);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Revisa los campos del formulario");
      return;
    }

    setCreating(true);

    try {
      const v = form.getValues();
      const payload: CreateUserRequest = {
        email: v.email,
        password: v.password,
        name: v.name,
        paternalSurname: v.paternalSurname,
        maternalSurname: v.maternalSurname?.trim() || undefined,
        phone: v.phone,
        role: v.role,
      };
      const result = await userService.createUser(payload);

      if (result.success) {
        toast.success("Usuario creado correctamente");
        resetForm();
        onUserCreated();
        onClose();
      } else {
        toast.error(result.error ?? "No se pudo crear el usuario");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error inesperado al crear el usuario");
    } finally {
      setCreating(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-[min(100vw-1rem,440px)] flex-col bg-white shadow-2xl ${poppins.className}`}
      >
        <div className="flex items-start justify-between p-4">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#303030]">
              Nuevo usuario
            </h2>
            <p className="text-sm text-[#303030]/90">
              Mismo registro que el API: nombre, apellidos, teléfono y contraseña
              segura.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4">
          <Form {...form}>
            <form id="create-user-form" onSubmit={handleCreateUser} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Mail}
                        label="Email"
                        autoComplete="email"
                        placeholder="usuario@ejemplo.com"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Lock}
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="8+ caracteres, mayúscula, número y símbolo"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        suffixIcon={showPassword ? EyeOff : Eye}
                        onSuffixIconClick={() => setShowPassword((v) => !v)}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Lock}
                        label="Confirmar contraseña"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repite la contraseña"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        suffixIcon={showConfirmPassword ? EyeOff : Eye}
                        onSuffixIconClick={() =>
                          setShowConfirmPassword((v) => !v)
                        }
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={User}
                        label="Nombre"
                        autoComplete="given-name"
                        placeholder="Nombre"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paternalSurname"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={User}
                        label="Apellido paterno"
                        autoComplete="family-name"
                        placeholder="Apellido paterno"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maternalSurname"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={User}
                        label="Apellido materno (opcional)"
                        autoComplete="off"
                        placeholder="Opcional"
                        disabled={creating}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Phone}
                        label="Teléfono"
                        autoComplete="tel"
                        placeholder="Teléfono de contacto"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Shield}
                        label="Rol"
                        options={[
                          { value: "user", label: "Usuario" },
                          { value: "seller", label: "Vendedor" },
                          { value: "admin", label: "Administrador" },
                        ]}
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={creating}
              className="flex-1 border-[#1868db] bg-[#f8f7fc] text-[#1868db] shadow-[0px_1px_3px_rgba(166,_175,_195,_0.4)] transition-all duration-200 hover:bg-[#1868db] hover:text-white"
            >
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              form="create-user-form"
              className="flex-1 bg-[#1868db] text-white hover:bg-[#1458c4]"
              disabled={creating}
            >
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Crear usuario
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
