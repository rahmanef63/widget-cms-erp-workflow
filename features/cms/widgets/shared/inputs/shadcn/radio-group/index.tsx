"use client"

interface RadioGroupPropertyInspectorProps {
  widget: any
  onChange: (widget: any) => void
}

export function RadioGroupPropertyInspector({ widget, onChange }: RadioGroupPropertyInspectorProps) {
  const handleChange = (key: string, value: any) => {
    onChange({
      ...widget,
      props: {
        ...widget.props,
        [key]: value,
      },
    })
  }

  const handleOptionsChange = (optionsText: string) => {
    const options = optionsText
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const [value, label] = line.split("|").map((s) => s.trim())
        return { value, label: label || value }
      })
    handleChange("options", options)
  }

  const getOptionsText = () => {
    const options = widget.props?.options || []
    return options.map((opt: any) => `${opt.value}${opt.label !== opt.value ? `|${opt.label}` : ""}`).join("\n")
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Group Label</label>
        <input
          type="text"
          value={widget.props?.label || ""}
          onChange={(e) => handleChange("label", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Enter group label..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Default Value</label>
        <input
          type="text"
          value={widget.props?.defaultValue || ""}
          onChange={(e) => handleChange("defaultValue", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Default selected value"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Options (one per line, format: value|label)</label>
        <textarea
          value={getOptionsText()}
          onChange={(e) => handleOptionsChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          rows={5}
          placeholder={`option1|Option 1\noption2|Option 2\noption3`}
        />
        <p className="text-xs text-gray-500 mt-1">
          Use "value|label" format. If no label provided, value will be used as label.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Orientation</label>
        <select
          value={widget.props?.orientation || "vertical"}
          onChange={(e) => handleChange("orientation", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
        </select>
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
