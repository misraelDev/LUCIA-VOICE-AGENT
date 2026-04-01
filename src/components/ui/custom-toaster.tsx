import { Toaster as Sonner } from "sonner"

export function CustomToaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]: group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:",
          success: "!bg-green-50 !border-green-200 !text-green-800",
          error: "!bg-red-50 !border-red-200 !text-red-800",
          warning: "!bg-yellow-50 !border-yellow-200 !text-yellow-800",
          info: "!bg-blue-50 !border-blue-200 !text-blue-800",
        },
        style: {
          background: "var(--background)",
          border: "1px solid var(--border)",
        },
      }}
      richColors
      theme="light"
    />
  )
} 