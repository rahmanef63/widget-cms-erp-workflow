"use client"
import * as React from "react"
import type { Node, Edge } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { X, Maximize2, Minimize2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

const DEVICE_PRESETS = [
  { key: "desktop", label: "Desktop", w: 1920, h: 1080 },
  { key: "laptop", label: "Laptop", w: 1366, h: 768 },
  { key: "tablet-p", label: "Tablet Portrait", w: 768, h: 1024 },
  { key: "tablet-l", label: "Tablet Landscape", w: 1024, h: 768 },
  { key: "mobile-p", label: "Mobile Portrait", w: 375, h: 667 },
  { key: "mobile-l", label: "Mobile Landscape", w: 667, h: 375 },
  { key: "square", label: "Square", w: 1024, h: 1024 },
] as const

type DeviceKey = (typeof DEVICE_PRESETS)[number]["key"]

interface PreviewWidgetProps {
  id: string
  title?: string
  nodes?: Node<CompNodeData>[]
  edges?: Edge[]
  rootIds?: string[]
  initialDevice?: DeviceKey
  onClose?: () => void
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const SIZE_CLASSES = {
  sm: "w-80 h-60",
  md: "w-96 h-72",
  lg: "w-[32rem] h-96",
  xl: "w-[40rem] h-[30rem]",
}

export function PreviewWidget({
  id,
  title = "Preview",
  nodes = [],
  edges = [],
  rootIds,
  initialDevice = "desktop",
  onClose,
  className,
  size = "md",
}: PreviewWidgetProps) {
  const [deviceKey, setDeviceKey] = React.useState<DeviceKey>(initialDevice)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [refreshKey, setRefreshKey] = React.useState(0)

  const preset = React.useMemo(() => {
    return DEVICE_PRESETS.find((p) => p.key === deviceKey) ?? DEVICE_PRESETS[0]
  }, [deviceKey])

  // Build maps for rendering
  const { nodesMap, childrenOf, computedRoots } = React.useMemo(() => {
    const nodesMap = new Map(nodes.map((n) => [n.id, n] as const))
    const childrenOf = new Map<string, string[]>()

    for (const e of edges) {
      const parentId = e.target
      const childId = e.source
      if (!childrenOf.has(parentId)) childrenOf.set(parentId, [])
      childrenOf.get(parentId)!.push(childId)
    }

    // If rootIds provided, use them; otherwise find roots automatically
    let computedRoots: string[]
    if (rootIds && rootIds.length > 0) {
      computedRoots = rootIds
    } else {
      const sourceIds = new Set(edges.map((e) => e.source))
      computedRoots = nodes.map((n) => n.id).filter((id) => !sourceIds.has(id) && id !== "preview")
    }

    return { nodesMap, childrenOf, computedRoots }
  }, [nodes, edges, rootIds])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    // Also trigger global refresh if available
    ;(window as any).__CMS_REFRESH__?.()
  }

  const renderContent = () => {
    if (computedRoots.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-sm text-gray-500">No components to preview</div>
      )
    }

    return (
      <div className="h-full w-full overflow-auto bg-white" key={refreshKey}>
        {computedRoots.map((rootId) => {
          const renderTree = (nodeId: string): React.ReactNode => {
            const node = nodesMap.get(nodeId)
            if (!node) return null

            const children = childrenOf.get(nodeId) || []
            const renderedChildren = children.map((childId) => (
              <React.Fragment key={childId}>{renderTree(childId)}</React.Fragment>
            ))

            // Simple rendering logic - you can expand this based on your component types
            const data = node.data as CompNodeData
            switch (data.type) {
              case "section":
                return (
                  <section key={nodeId} className="w-full" style={data.props}>
                    {renderedChildren}
                  </section>
                )
              case "text":
                return (
                  <div key={nodeId} style={data.props}>
                    {data.props?.content || "Text content"}
                    {renderedChildren}
                  </div>
                )
              case "button":
                return (
                  <button key={nodeId} className="px-4 py-2 bg-blue-500 text-white rounded" style={data.props}>
                    {data.props?.label || "Button"}
                    {renderedChildren}
                  </button>
                )
              case "column":
                return (
                  <div key={nodeId} className="flex flex-col" style={data.props}>
                    {renderedChildren}
                  </div>
                )
              default:
                return (
                  <div key={nodeId} className="p-2 border border-dashed border-gray-300 rounded">
                    {data.type}: {data.label}
                    {renderedChildren}
                  </div>
                )
            }
          }

          return <React.Fragment key={rootId}>{renderTree(rootId)}</React.Fragment>
        })}
      </div>
    )
  }

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden transition-all duration-200",
        isExpanded ? "fixed inset-4 z-50" : SIZE_CLASSES[size],
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 py-2 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <Select value={deviceKey} onValueChange={(v) => setDeviceKey(v as DeviceKey)}>
            <SelectTrigger className="h-7 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEVICE_PRESETS.map((d) => (
                <SelectItem key={d.key} value={d.key} className="text-xs">
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={handleRefresh} className="h-7 w-7 p-0">
            <RefreshCw className="h-3 w-3" />
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-7 w-7 p-0">
            {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>

          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <div
          className="w-full h-full border-2 border-gray-100"
          style={{
            aspectRatio: isExpanded ? "auto" : `${preset.w}/${preset.h}`,
          }}
        >
          {renderContent()}
        </div>

        {!isExpanded && (
          <div className="px-3 py-1 text-xs text-gray-500 bg-gray-50 border-t">
            {preset.label} • {preset.w}×{preset.h}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
