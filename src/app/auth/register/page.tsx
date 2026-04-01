"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/schema/register";
import { userService } from "@/services/UserService";
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon";
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles";
import { PhoneInput } from "@/components/ui/common/PhoneInput/PhoneInput";
import { e164ToPhoneInputValue } from "@/lib/phone-input-value";

export default function RegisterPage() {
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      paternalSurname: "",
      maternalSurname: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setLoading(true);
    try {
      const response = await userService.signUp({
        email: data.email,
        password: data.password,
        name: data.name,
        paternalSurname: data.paternalSurname,
        maternalSurname: data.maternalSurname?.trim() || "",
        phone: data.phone.trim(),
        role: "USER",
      });

      if (response.success) {
        const { title, detail } = response;
        if (title && detail) {
          toast.success(title, { description: detail });
        } else {
          toast.success((detail ?? title) ?? "");
        }
        router.push("/auth/register/success");
      } else {
        const { title, detail } = response;
        if (title && detail) {
          toast.error(title, { description: detail });
        } else {
          toast.error((detail ?? title) ?? "");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-black text-white relative min-h-[200px] md:min-h-0">
        <Image
          src="/login/login.png"
          alt="Lucía"
          fill
          sizes="(max-width: 767px) 0px, 50vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col flex-1 w-full items-center justify-center p-6 md:p-12 bg-white">
        <div className="flex flex-col justify-center w-full max-w-xl mx-auto">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
              Crear cuenta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Completa tus datos. Contraseña: entre 8 y 128 caracteres, con mayúscula,
              minúscula, número y carácter especial.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <InputWithIcon
                          icon={User}
                          label="Nombre(s)"
                          required
                          autoComplete="given-name"
                          placeholder="María"
                          disabled={loading}
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
                          required
                          autoComplete="family-name"
                          placeholder="García"
                          disabled={loading}
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
              </div>

              <FormField
                control={form.control}
                name="maternalSurname"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                        <InputWithIcon
                          icon={User}
                          label="Apellido materno (opcional)"
                          autoComplete="additional-name"
                          placeholder="López"
                          disabled={loading}
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

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0 min-w-0">
                      <FormControl>
                        <InputWithIcon
                          icon={Mail}
                          label="Correo electrónico"
                          required
                          type="email"
                          autoComplete="email"
                          placeholder="correo@ejemplo.com"
                          disabled={loading}
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
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0 min-w-0">
                      <FormControl>
                        <PhoneInput
                          label="Teléfono"
                          required
                          defaultCountry="MX"
                          disabled={loading}
                          value={e164ToPhoneInputValue(field.value, "MX")}
                          onChange={(v) => field.onChange(v.fullNumber)}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <InputWithIcon
                          icon={Lock}
                          label="Contraseña"
                          required
                          type={showPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="8+ caracteres, mayúscula, número, símbolo"
                          disabled={loading}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          suffixIcon={showPassword ? Eye : EyeOff}
                          onSuffixIconClick={() =>
                            setShowPassword(!showPassword)
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
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <InputWithIcon
                          icon={Lock}
                          label="Confirmar contraseña"
                          required
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Repite la contraseña"
                          disabled={loading}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          suffixIcon={showConfirmPassword ? Eye : EyeOff}
                          onSuffixIconClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          error={fieldState.error?.message}
                          className={AUTH_INPUT_FIELD_CLASS}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1868db] hover:bg-[#1458c4] text-white py-2.5"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Crear cuenta
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700 dark:text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth/login"
                className="text-sm font-medium text-[#1868db] hover:text-[#1458c4] dark:text-[#1868db] underline-offset-2 hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
