"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

function CharacteristicTabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function CharacteristicTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center justify-center gap-[18px] border-b bg-transparent p-0 pb-1 shadow-none",
        className
      )}
      {...props}
    />
  )
}

function CharacteristicTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative h-8 sm:h-9 md:h-10 bg-transparent hover:bg-transparent data-[state=active]:bg-transparent px-2 sm:px-3 py-1 sm:py-2 text-base font-normal text-[#303030] shadow-none border-0 border-l-0 border-r-0 border-t-0 border-b-4 border-transparent data-[state=active]:border-b-[#7854F7] data-[state=active]:text-[#7854F7] data-[state=active]:font-semibold data-[state=active]:shadow-none focus-visible:border-0 focus-visible:ring-0 rounded-none flex-shrink-0 transition-colors",
        className
      )}
      {...props}
    />
  )
}

function CharacteristicTabsContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none mt-0", className)}
      style={{ marginTop: 0 }}
      {...props}
    >
      {/* Contenedor que rompe el layout para aplicar fondo diferente */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#F6F6FF]">
        <div className="px-6 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-14 md:py-16">
          {children}
        </div>
      </div>
    </TabsPrimitive.Content>
  )
}

export { CharacteristicTabs, CharacteristicTabsList, CharacteristicTabsTrigger, CharacteristicTabsContent }
