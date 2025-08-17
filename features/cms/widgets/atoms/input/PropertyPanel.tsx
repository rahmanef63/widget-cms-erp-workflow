"use client"

interface InputPropertyPanelProps {
  widget: any
  onChange: (widget: any) => void
}

export function InputPropertyPanel({ widget, onChange }: InputPropertyPanelProps) {
  if (!widget) {
    return <div className="p-4 text-sm text-gray-500">No widget selected</div>
  }

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
        <label className="block text-sm font-medium mb-1">Input Type</label>
        <select
          value={widget.props?.type || "text"}
          onChange={(e) => handleChange("type", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="password">Password</option>
          <option value="number">Number</option>
          <option value="tel">Phone</option>
          <option value="url">URL</option>
          <option value="search">Search</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
          <option value="datetime-local">DateTime</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Default Value</label>
        <input
          type="text"
          value={widget.props?.defaultValue || ""}
          onChange={(e) => handleChange("defaultValue", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Default input value..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Min Length</label>
          <input
            type="number"
            value={widget.props?.minLength || ""}
            onChange={(e) => handleChange("minLength", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border rounded-md text-sm"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Length</label>
          <input
            type="number"
            value={widget.props?.maxLength || ""}
            onChange={(e) => handleChange("maxLength", e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 border rounded-md text-sm"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
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
            id="readonly"
            checked={widget.props?.readOnly || false}
            onChange={(e) => handleChange("readOnly", e.target.checked)}
            className="rounded"
          />
          <label htmlFor="readonly" className="text-sm font-medium">
            Read Only
          </label>
        </div>
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
