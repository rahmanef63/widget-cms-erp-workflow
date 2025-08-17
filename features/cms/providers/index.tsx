"use client"

import type React from "react"
import { ReactFlowProvider } from "reactflow"
import type { Node, Edge } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { CMSContextProvider } from "./cms-context"
import { CanvasContextProvider } from "./canvas-context"

interface AllProvidersProps {
  children: React.ReactNode
  initialNodes: Node<CompNodeData>[]
  initialEdges: Edge[]
  selectedNodeId: string | null
  onNodesChange: (nodes: Node<CompNodeData>[]) => void
  onEdgesChange: (edges: Edge[]) => void
  onSelectedNodeChange: (id: string | null) => void
}

export function AllProviders({
  children,
  initialNodes,
  initialEdges,
  selectedNodeId,
  onNodesChange,
  onEdgesChange,
  onSelectedNodeChange,
}: AllProvidersProps) {
  console.log("🏗️ All Providers initialized:", {
    nodeCount: initialNodes.length,
    edgeCount: initialEdges.length,
    selectedNodeId,
    timestamp: new Date().toISOString(),
  })

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
        <CanvasContextProvider
          nodes={initialNodes}
          edges={initialEdges}
          selectedNodeId={selectedNodeId}
          onSelectedNodeChange={onSelectedNodeChange}
        >
          {children}
        </CanvasContextProvider>
      </CMSContextProvider>
    </ReactFlowProvider>
  )
}

// Re-export hooks for convenience
export { useCMSContext } from "./cms-context"
export { useCanvasContext } from "./canvas-context"
