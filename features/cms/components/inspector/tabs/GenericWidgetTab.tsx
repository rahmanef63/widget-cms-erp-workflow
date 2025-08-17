"use client"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface GenericWidgetTabProps {
  selected: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
}

export function GenericWidgetTab({ selected, onChange }: GenericWidgetTabProps) {
  return (
    <div className="space-y-3">
      {/* Generic Properties */}
      <div>
        <Label htmlFor="genericProps" className="text-xs font-medium">
          Generic Properties
        </Label>
        <Textarea
          id="genericProps"
          rows={4}
          value={JSON.stringify(selected.data.props || {}, null, 2)}
          onChange={(e) => {
            try {
              const props = JSON.parse(e.target.value)
              onChange((d) => ({ ...d, props }))
            } catch (error) {
              console.error("Invalid JSON", error)
            }
          }}
          className="mt-1"
          placeholder="Enter generic properties as JSON..."
        />
      </div>
    </div>
  )
}
