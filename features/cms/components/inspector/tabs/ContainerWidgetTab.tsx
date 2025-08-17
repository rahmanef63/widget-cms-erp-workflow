"use client"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { createPropertySetter } from "@/features/cms/lib/inspector-helpers"


interface ContainerWidgetTabProps {
  selected: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
}

export function ContainerWidgetTab({ selected, onChange }: ContainerWidgetTabProps) {
  const setProp = createPropertySetter(onChange)

  return (
    <div className="space-y-3">
      {/* Container Background */}
      <div>
        <Label htmlFor="containerBackground" className="text-xs font-medium">
          Background
        </Label>
        <Select
          value={String(selected.data.props.background || "Default")}
          onValueChange={(v) => setProp("background", v)}
        >
          <SelectTrigger className="h-9 text-sm flex-1">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Default">Default</SelectItem>
            <SelectItem value="Primary">Primary</SelectItem>
            <SelectItem value="Secondary">Secondary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Container Padding */}
      <div>
        <Label htmlFor="containerPadding" className="text-xs font-medium">
          Padding
        </Label>
        <Input
          id="containerPadding"
          value={String(selected.data.props.padding || "12px")}
          onChange={(e) => setProp("padding", e.target.value)}
          className="mt-1 h-8"
          placeholder="Enter padding..."
        />
      </div>
    </div>
  )
}
