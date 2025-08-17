"use client"
import { createContext, useContext, type ReactNode } from "react"

interface CMSContextType {
  nodes: any[]
  edges: any[]
  selectedNodeId: string | null
  onNodesChange: (nodes: any[]) => void
  onEdgesChange: (edges: any[]) => void
  onSelectedNodeChange: (id: string | null) => void
}

const CMSContext = createContext<CMSContextType | null>(null)

interface CMSContextProviderProps {
  children: ReactNode
  initialNodes: any[]
  initialEdges: any[]
  selectedNodeId: string | null
  onNodesChange: (nodes: any[]) => void
  onEdgesChange: (edges: any[]) => void
  onSelectedNodeChange: (id: string | null) => void
}

export function CMSContextProvider({
  children,
  initialNodes,
  initialEdges,
  selectedNodeId,
  onNodesChange,
  onEdgesChange,
  onSelectedNodeChange,
}: CMSContextProviderProps) {
  const value: CMSContextType = {
    nodes: initialNodes,
    edges: initialEdges,
    selectedNodeId,
    onNodesChange,
    onEdgesChange,
    onSelectedNodeChange,
  }

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>
}

export function useCMSContext() {
  const context = useContext(CMSContext)
  if (!context) {
    throw new Error("useCMSContext must be used within CMSContextProvider")
  }
  return context
}
