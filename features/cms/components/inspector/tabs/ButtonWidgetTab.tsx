"use client"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { createPropertySetter } from "@/features/cms/lib/inspector-helpers"

interface ButtonWidgetTabProps {
  selected: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
}

export function ButtonWidgetTab({ selected, onChange }: ButtonWidgetTabProps) {
  const setProp = createPropertySetter(onChange)

  return (
    <div className="space-y-3">
      {/* Button Label */}
      <div>
        <Label htmlFor="buttonLabel" className="text-xs font-medium">
          Button Label
        </Label>
        <Input
          id="buttonLabel"
          value={selected.data.props.label || "Button"}
          onChange={(e) => setProp("label", e.target.value)}
          className="mt-1 h-8"
          placeholder="Enter button label..."
        />
      </div>

      {/* Button Style */}
      <div>
        <Label htmlFor="buttonStyle" className="text-xs font-medium">
          Button Style
        </Label>
        <Select value={String(selected.data.props.style || "default")} onValueChange={(v) => setProp("style", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
