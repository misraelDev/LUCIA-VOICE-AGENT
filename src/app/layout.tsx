import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { ConditionalAgentProvider } from "@/components/providers/conditional-agent-provider";
import { CustomToaster } from "@/components/ui/custom-toaster";
import { QueryProvider } from "@/providers/query-provider";
import { WebVitalsLogger } from "@/components/web-vitals-logger";

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Lucia - Asistente Virtual",
  description: "Lucia conversa de forma natural y fluida con tus clientes",
  icons: {
    icon: '/logotipo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta httpEquiv="content-language" content="es" />
        <meta name="google" content="notranslate" />
        <link
          rel="preload"
          href="/logo_lucia_wb.svg"
          as="image"
          type="image/svg+xml"
        />
      </head>
      <body className={`${poppins.className}`}>
        <QueryProvider>
          <AuthProvider>
            <ConditionalAgentProvider>
              {children}
            </ConditionalAgentProvider>
          </AuthProvider>
          <CustomToaster />
          <WebVitalsLogger />
        </QueryProvider>
      </body>
    </html>
  );
}