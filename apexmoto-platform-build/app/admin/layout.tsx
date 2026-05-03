"use client"

import { StoreProvider } from "@/lib/store"
import { Toaster } from "sonner"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StoreProvider>
      {children}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            borderRadius: "16px",
          }
        }}
      />
    </StoreProvider>
  )
}
