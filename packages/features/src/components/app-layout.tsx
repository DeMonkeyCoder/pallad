import { install } from "@github/hotkey"
import type React from "react"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
}

export const AppLayout = ({ children, className }: AppLayoutProps) => {
  const location = useLocation()
  // biome-ignore lint: dependent just on location
  useEffect(() => {
    if (typeof document === "undefined") return
    for (const el of document.querySelectorAll("[data-hotkey]")) {
      install(el as never)
    }
  }, [location])
  return (
    <div
      className={`flex flex-col flex-1 bg-background ${className}`}
      data-testid="appLayout"
    >
      {children}
    </div>
  )
}
