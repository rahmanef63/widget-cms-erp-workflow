"use client"
import * as React from "react"
import type { Node, Edge } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { PreviewWidget } from "./PreviewWidget"
import { Button } from "@/components/ui/button"
import { Plus, Grid3X3 } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface PreviewInstance {
  id: string
  title: string
  rootIds?: string[]
  device?: "desktop" | "laptop" | "tablet-p" | "tablet-l" | "mobile-p" | "mobile-l" | "square"
  size?: "sm" | "md" | "lg" | "xl"
}

interface PreviewManagerProps {
  nodes: Node<CompNodeData>[]
  edges: Edge[]
  className?: string
}

export function PreviewManager({ nodes, edges, className }: PreviewManagerProps) {
  const [previews, setPreviews] = React.useState<PreviewInstance[]>([{ id: "main", title: "Main Preview", size: "lg" }])
  const [layout, setLayout] = React.useState<"grid" | "stack">("grid")

  const addPreview = () => {
    const newId = `preview-${Date.now()}`
    setPreviews((prev) => [
      ...prev,
      {
        id: newId,
        title: `Preview ${prev.length + 1}`,
        size: "md",
      },
    ])
  }

  const removePreview = (id: string) => {
    setPreviews((prev) => prev.filter((p) => p.id !== id))
  }

  const updatePreview = (id: string, updates: Partial<PreviewInstance>) => {
    setPreviews((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Preview Manager</h3>
          <span className="text-xs text-gray-500">({previews.length} active)</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLayout(layout === "grid" ? "stack" : "grid")}
            className="h-7 w-7 p-0"
          >
            <Grid3X3 className="h-3 w-3" />
          </Button>

          <Button variant="ghost" size="sm" onClick={addPreview} className="h-7 px-2 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Add Preview
          </Button>
        </div>
      </div>

      {/* Preview Grid/Stack */}
      <div
        className={cn(
          "flex-1 p-3 overflow-auto",
          layout === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-min"
            : "flex flex-col gap-4",
        )}
      >
        {previews.map((preview) => (
          <PreviewWidget
            key={preview.id}
            id={preview.id}
            title={preview.title}
            nodes={nodes}
            edges={edges}
            rootIds={preview.rootIds}
            initialDevice={preview.device}
            size={preview.size}
            onClose={previews.length > 1 ? () => removePreview(preview.id) : undefined}
            className={layout === "stack" ? "w-full" : ""}
          />
        ))}
      </div>
    </div>
  )
}
