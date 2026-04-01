"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginFormData, loginSchema } from "@/schema/login";
import { userService } from "@/services/UserService";
import { useAuth } from "@/hooks/useAuth";
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon";
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles";

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const router = useRouter();
  const { applySessionFromStorage } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      const response = await userService.login({
        email: data.email,
        password: data.password,
      });
      if (response.success) {
        const title = response.title;
        const detail = response.detail ?? response.message;
        if (title && detail) {
          toast.success(title, { description: detail });
        } else {
          toast.success((detail ?? title) ?? "");
        }
        applySessionFromStorage();
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push("/dashboard");
      } else {
        const title = response.title;
        const detail = response.detail ?? response.message;
        if (title && detail) {
          toast.error(title, { description: detail });
        } else {
          toast.error((detail ?? title) ?? "");
        }
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
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
              Inicia sesión en tu cuenta
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu correo electrónico y contraseña para iniciar sesión.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Mail}
                        label="Correo electrónico"
                        required
                        type="email"
                        autoComplete="email"
                        placeholder="correo@ejemplo.com"
                        disabled={isLoading}
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
                        required
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Tu contraseña"
                        disabled={isLoading}
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

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="keep-logged-in"
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      setIsChecked(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="keep-logged-in"
                    className="text-sm font-normal text-gray-700 dark:text-gray-400 cursor-pointer"
                  >
                    Mantener sesión iniciada
                  </Label>
                </div>
                <Link
                  href="/reset-password"
                  className="text-sm font-medium text-[#1868db] hover:text-[#1458c4] dark:text-[#1868db] underline-offset-2 hover:underline shrink-0"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1868db] hover:bg-[#1458c4] text-white py-2.5"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Iniciar sesión
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/auth/register"
              className="text-sm font-medium text-[#1868db] hover:text-[#1458c4] dark:text-[#1868db] underline-offset-2 hover:underline"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
