"use client"
import { createContext, useContext, type ReactNode, useState } from "react"

interface CanvasContextType {
  zoom: number
  setZoom: (zoom: number) => void
  viewport: { x: number; y: number; zoom: number }
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void
}

const CanvasContext = createContext<CanvasContextType | null>(null)

interface CanvasContextProviderProps {
  children: ReactNode
}

export function CanvasContextProvider({ children }: CanvasContextProviderProps) {
  const [zoom, setZoom] = useState(1)
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })

  const value: CanvasContextType = {
    zoom,
    setZoom,
    viewport,
    setViewport,
  }

  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
}

export function useCanvasContext() {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error("useCanvasContext must be used within CanvasContextProvider")
  }
  return context
}
