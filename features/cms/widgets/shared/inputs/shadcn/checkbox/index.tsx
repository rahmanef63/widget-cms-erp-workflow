"use client"

interface CheckboxPropertyInspectorProps {
  widget: any
  onChange: (widget: any) => void
}

export function CheckboxPropertyInspector({ widget, onChange }: CheckboxPropertyInspectorProps) {
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
          value={widget.props?.label || ""}
          onChange={(e) => handleChange("label", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Enter checkbox label..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Value</label>
        <input
          type="text"
          value={widget.props?.value || ""}
          onChange={(e) => handleChange("value", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="checkbox-value"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="default-checked"
          checked={widget.props?.defaultChecked || false}
          onChange={(e) => handleChange("defaultChecked", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="default-checked" className="text-sm font-medium">
          Default Checked
        </label>
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
