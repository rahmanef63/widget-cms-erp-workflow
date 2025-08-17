"use client"

interface TextareaPropertyInspectorProps {
  widget: any
  onChange: (widget: any) => void
}

export function TextareaPropertyInspector({ widget, onChange }: TextareaPropertyInspectorProps) {
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
        <label className="block text-sm font-medium mb-1">Placeholder</label>
        <input
          type="text"
          value={widget.props?.placeholder || ""}
          onChange={(e) => handleChange("placeholder", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Enter placeholder text..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Default Value</label>
        <textarea
          value={widget.props?.defaultValue || ""}
          onChange={(e) => handleChange("defaultValue", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          rows={3}
          placeholder="Enter default value..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Rows</label>
          <input
            type="number"
            value={widget.props?.rows || 3}
            onChange={(e) => handleChange("rows", Number.parseInt(e.target.value))}
            className="w-full px-3 py-2 border rounded-md text-sm"
            min="1"
            max="20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Length</label>
          <input
            type="number"
            value={widget.props?.maxLength || ""}
            onChange={(e) => handleChange("maxLength", e.target.value ? Number.parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border rounded-md text-sm"
            min="1"
            placeholder="No limit"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="disabled"
          checked={widget.props?.disabled || false}
          onChange={(e) => handleChange("disabled", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="disabled" className="text-sm font-medium">
          Disabled
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="required"
          checked={widget.props?.required || false}
          onChange={(e) => handleChange("required", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="required" className="text-sm font-medium">
          Required
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
