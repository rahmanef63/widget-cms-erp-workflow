"use client"
import * as React from "react"
import { Handle, Position } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { LivePreview } from "@/features/cms/widgets/core/renderers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

const DEVICE_PRESETS = [
  { key: "desktop", label: "Desktop 1920×1080", w: 1920, h: 1080 },
  { key: "laptop", label: "Laptop 1366×768", w: 1366, h: 768 },
  { key: "tablet-p", label: "Tablet Portrait 768×1024", w: 768, h: 1024 },
  { key: "tablet-l", label: "Tablet Landscape 1024×768", w: 1024, h: 768 },
  { key: "mobile-p", label: "Mobile Portrait 375×667", w: 375, h: 667 },
  { key: "mobile-l", label: "Mobile Landscape 667×375", w: 667, h: 375 },
  { key: "square", label: "Square 1024×1024", w: 1024, h: 1024 },
] as const

type DeviceKey = (typeof DEVICE_PRESETS)[number]["key"]

export function PreviewNode({ data }: { data: CompNodeData }) {
  const [deviceKey, setDeviceKey] = React.useState<DeviceKey>("desktop")
  const refresh = () => (window as any).__CMS_REFRESH__?.()

  const preset = React.useMemo(() => {
    return DEVICE_PRESETS.find((p) => p.key === deviceKey) ?? DEVICE_PRESETS[0]
  }, [deviceKey])

  return (
    <div className="rounded-2xl border bg-white p-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-gray-50">
        <div className="size-2 rounded-full bg-red-400" />
        <div className="size-2 rounded-full bg-yellow-400" />
        <div className="size-2 rounded-full bg-green-400" />
        <span className="ml-2 text-gray-600 text-xs">Preview sink (dynamic)</span>

        <div className="ml-3 flex items-center gap-2">
          <span className="text-xs text-gray-500">Rasio:</span>
          <Select value={deviceKey} onValueChange={(v) => setDeviceKey(v as DeviceKey)}>
            <SelectTrigger className="h-7 w-[160px] text-xs">
              <SelectValue placeholder="Pilih rasio" />
            </SelectTrigger>
            <SelectContent>
              {DEVICE_PRESETS.map((d) => (
                <SelectItem key={d.key} value={d.key} className="text-xs">
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />
        <button onClick={refresh} className="text-[10px] px-2 py-1 border rounded-lg hover:bg-gray-100">
          Refresh
        </button>
      </div>

      {/* Preview viewport with selected aspect ratio */}
      <div className="p-3">
        <ScrollArea className="max-h-full pr-2">
          <div
            className="w-full rounded-lg border bg-white overflow-hidden"
            style={{
              // Maintain chosen device aspect ratio in the viewport box
              aspectRatio: `${preset.w}/${preset.h}`,
            }}
          >
            <div className="size-full">
              {data.previewRoots?.length ? (
                <LivePreview roots={data.previewRoots} version={data.previewBump || 0} />
              ) : (
                <div className="p-4 text-xs text-gray-500 h-full w-full flex items-center justify-center text-center">
                  {"Connect components → this node to preview."}
                </div>
              )}
            </div>
          </div>

          {/* Info line */}
          <div className="mt-2 text-[10px] text-gray-500">
            {preset.label} · Rasio {preset.w}:{preset.h}
          </div>
        </ScrollArea>
      </div>

      <Handle type="target" position={Position.Left} />
    </div>
  )
}
