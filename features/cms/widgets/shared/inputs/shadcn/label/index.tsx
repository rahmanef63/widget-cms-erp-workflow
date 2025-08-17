"use client"

interface LabelPropertyInspectorProps {
  widget: any
  onChange: (widget: any) => void
}

export function LabelPropertyInspector({ widget, onChange }: LabelPropertyInspectorProps) {
  const handleChange = (key: string, value: any) => {
    onChange({
      ...widget,
      props: {
        ...widget.props,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Label Text</label>
        <input
          type="text"
          value={widget.props?.children || ""}
          onChange={(e) => handleChange("children", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Enter label text..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">For (Input ID)</label>
        <input
          type="text"
          value={widget.props?.htmlFor || ""}
          onChange={(e) => handleChange("htmlFor", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="input-id"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="required-indicator"
          checked={widget.props?.required || false}
          onChange={(e) => handleChange("required", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="required-indicator" className="text-sm font-medium">
          Show Required Indicator (*)
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Custom Class</label>
        <input
          type="text"
          value={widget.props?.className || ""}
          onChange={(e) => handleChange("className", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Additional CSS classes"
        />
      </div>
    </div>
  )
}
