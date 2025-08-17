"use client"

interface InputOTPPropertyInspectorProps {
  widget: any
  onChange: (widget: any) => void
}

export function InputOTPPropertyInspector({ widget, onChange }: InputOTPPropertyInspectorProps) {
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
        <label className="block text-sm font-medium mb-1">Max Length</label>
        <input
          type="number"
          value={widget.props?.maxLength || 6}
          onChange={(e) => handleChange("maxLength", Number.parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          min="1"
          max="12"
        />
        <p className="text-xs text-gray-500 mt-1">Number of OTP digits (1-12)</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Pattern</label>
        <select
          value={widget.props?.pattern || "PATTERN_FORMAT_DIGITS"}
          onChange={(e) => handleChange("pattern", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="PATTERN_FORMAT_DIGITS">Digits Only</option>
          <option value="PATTERN_FORMAT_LETTERS">Letters Only</option>
          <option value="PATTERN_FORMAT_MIXED">Mixed (Letters + Digits)</option>
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
        <label className="block text-sm font-medium mb-1">Placeholder Character</label>
        <input
          type="text"
          value={widget.props?.placeholder || "○"}
          onChange={(e) => handleChange("placeholder", e.target.value.charAt(0))}
          className="w-full px-3 py-2 border rounded-md text-sm"
          maxLength={1}
          placeholder="○"
        />
        <p className="text-xs text-gray-500 mt-1">Single character to show in empty slots</p>
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
