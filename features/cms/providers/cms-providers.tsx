"use client"
import type { ReactNode } from "react"
import { ReactFlowProvider } from "reactflow"
import { CMSContextProvider } from "./cms-context"
import { CanvasContextProvider } from "./canvas-context"

interface CMSProvidersProps {
  children: ReactNode
  initialNodes: any[]
  initialEdges: any[]
  selectedNodeId: string | null
  onNodesChange: (nodes: any[]) => void
  onEdgesChange: (edges: any[]) => void
  onSelectedNodeChange: (id: string | null) => void
}

export function CMSProviders({
  children,
  initialNodes,
  initialEdges,
  selectedNodeId,
  onNodesChange,
  onEdgesChange,
  onSelectedNodeChange,
}: CMSProvidersProps) {
  return (
    <ReactFlowProvider>
      <CMSContextProvider
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        selectedNodeId={selectedNodeId}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectedNodeChange={onSelectedNodeChange}
      >
        <CanvasContextProvider>{children}</CanvasContextProvider>
      </CMSContextProvider>
    </ReactFlowProvider>
  )
}
