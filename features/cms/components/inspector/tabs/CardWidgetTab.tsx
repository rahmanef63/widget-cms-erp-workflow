"use client"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createPropertySetter } from "@/features/cms/lib/inspector-helpers"

interface CardWidgetTabProps {
  selected: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
}

export function CardWidgetTab({ selected, onChange }: CardWidgetTabProps) {
  const setProp = createPropertySetter(onChange)

  return (
    <div className="space-y-3">
      {/* Card Title */}
      <div>
        <Label htmlFor="cardTitle" className="text-xs font-medium">
          Card Title
        </Label>
        <Input
          id="cardTitle"
          value={selected.data.props.title || "Card Title"}
          onChange={(e) => setProp("title", e.target.value)}
          className="mt-1 h-8"
          placeholder="Enter card title..."
        />
      </div>

      {/* Card Description */}
      <div>
        <Label htmlFor="cardDescription" className="text-xs font-medium">
          Card Description
        </Label>
        <Textarea
          id="cardDescription"
          rows={4}
          value={selected.data.props.description || "Card Description"}
          onChange={(e) => setProp("description", e.target.value)}
          className="mt-1"
          placeholder="Enter card description..."
        />
      </div>
    </div>
  )
}
