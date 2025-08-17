"use client"

import type React from "react"
import { useEffect } from "react"
import ReactFlow, { MiniMap, Controls, Background, useReactFlow } from "reactflow"
import "reactflow/dist/style.css"

type Props = React.ComponentProps<typeof ReactFlow>

// Component to expose ReactFlow instance globally for navigation toolbar
function ReactFlowInstanceProvider({ children }: { children: React.ReactNode }) {
  const reactFlowInstance = useReactFlow()

  useEffect(() => {
    // Expose ReactFlow instance globally for toolbar access
    ;(window as any).__REACT_FLOW_INSTANCE__ = reactFlowInstance
    console.log("🎯 ReactFlow instance exposed globally for navigation toolbar")

    // Log initial viewport state only once
    const viewport = reactFlowInstance.getViewport()
    console.log("📊 Initial ReactFlow viewport:", {
      x: viewport.x,
      y: viewport.y,
      zoom: viewport.zoom,
      timestamp: new Date().toISOString(),
    })

    return () => {
      console.log("🧹 Cleaning up ReactFlow instance")
      delete (window as any).__REACT_FLOW_INSTANCE__
      delete (window as any).__VIEWPORT_HANDLER__
    }
  }, []) // Empty dependency array to run only once

  return <>{children}</>
}

// Static import avoids creating a separate lazy chunk that can fail to load.
export default function ReactFlowCanvas(props: Props) {
  // Only log in development and reduce frequency
  if (process.env.NODE_ENV === "development") {
    console.log("🎨 ReactFlowCanvas rendering with props:", {
      nodeCount: props.nodes?.length || 0,
      edgeCount: props.edges?.length || 0,
      hasOnNodesChange: !!props.onNodesChange,
      hasOnEdgesChange: !!props.onEdgesChange,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <ReactFlow {...props}>
      <ReactFlowInstanceProvider>
        {props.children}
        <MiniMap
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Controls
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        <Background
          variant="dots"
          gap={20}
          size={1}
          style={{
            backgroundColor: "#fafafa",
          }}
        />
      </ReactFlowInstanceProvider>
    </ReactFlow>
  )
}
