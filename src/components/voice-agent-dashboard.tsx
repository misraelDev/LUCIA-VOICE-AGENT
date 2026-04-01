"use client"

import type React from "react"
import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ConversationList } from "@/components/conversation-list"
import { ConversationDetails } from "@/components/conversation-details"
import {  SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

export function VoiceAgentDashboard() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Agente de Atención al Cliente</h1>
                <p className="">
                  Gestiona las interacciones y configuraciones de tu agente de voz
                </p>
              </div>
              <div className="px-4 lg:px-6">
                <Tabs defaultValue="conversations" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="conversations">Conversaciones</TabsTrigger>
                    <TabsTrigger value="analytics">Análisis</TabsTrigger>
                    <TabsTrigger value="settings">Configuración</TabsTrigger>
                  </TabsList>
                  <TabsContent value="conversations" className="mt-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      <Card className="col-span-1 p-4">
                        <ConversationList
                          onSelectConversation={setSelectedConversation}
                          selectedConversation={selectedConversation}
                        />
                      </Card>
                      <Card className="col-span-1 lg:col-span-2 p-4">
                        {selectedConversation ? (
                          <ConversationDetails conversationId={selectedConversation} />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <p className="">Selecciona una conversación para ver los detalles</p>
                          </div>
                        )}
                      </Card>
                    </div>
                  </TabsContent>
                  <TabsContent value="analytics" className="mt-4">
                    <Card className="p-4">
                      <h2 className="text-xl font-semibold mb-4">Análisis de Datos</h2>
                      <p className="">
                        Aquí se mostrarán estadísticas y análisis de las conversaciones.
                      </p>
                    </Card>
                  </TabsContent>
                  <TabsContent value="settings" className="mt-4">
                    <Card className="p-4">
                      <h2 className="text-xl font-semibold mb-4">Configuración del Agente</h2>
                      <p className="">Configura los parámetros de tu agente de voz y texto.</p>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
    </SidebarProvider>
  )
} 