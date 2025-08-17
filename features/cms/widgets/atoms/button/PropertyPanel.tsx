"use client"

interface ButtonPropertyPanelProps {
  widget: any
  onChange: (widget: any) => void
}

export function ButtonPropertyPanel({ widget, onChange }: ButtonPropertyPanelProps) {
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
        <label className="block text-sm font-medium mb-1">Button Text</label>
        <input
          type="text"
          value={widget.props?.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Enter button text..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Variant</label>
        <select
          value={widget.props?.variant || "default"}
          onChange={(e) => handleChange("variant", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="default">Default</option>
          <option value="destructive">Destructive</option>
          <option value="outline">Outline</option>
          <option value="secondary">Secondary</option>
          <option value="ghost">Ghost</option>
          <option value="link">Link</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <select
            value={widget.props?.size || "default"}
            onChange={(e) => handleChange("size", e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="default">Default</option>
            <option value="sm">Small</option>
            <option value="lg">Large</option>
            <option value="icon">Icon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={widget.props?.type || "button"}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="button">Button</option>
            <option value="submit">Submit</option>
            <option value="reset">Reset</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Link URL (optional)</label>
        <input
          type="url"
          value={widget.props?.href || ""}
          onChange={(e) => handleChange("href", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="https://example.com"
        />
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
