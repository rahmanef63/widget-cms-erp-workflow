"use client"

interface TextPropertyPanelProps {
  widget: any
  onChange: (widget: any) => void
}

export function TextPropertyPanel({ widget, onChange }: TextPropertyPanelProps) {
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
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          value={widget.props?.content || ""}
          onChange={(e) => handleChange("content", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
          rows={3}
          placeholder="Enter your text content..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Element Type</label>
        <select
          value={widget.props?.element || "p"}
          onChange={(e) => handleChange("element", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
          <option value="span">Span</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Size</label>
          <select
            value={widget.props?.fontSize || "base"}
            onChange={(e) => handleChange("fontSize", e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="xs">XS</option>
            <option value="sm">SM</option>
            <option value="base">Base</option>
            <option value="lg">LG</option>
            <option value="xl">XL</option>
            <option value="2xl">2XL</option>
            <option value="3xl">3XL</option>
            <option value="4xl">4XL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Weight</label>
          <select
            value={widget.props?.fontWeight || "normal"}
            onChange={(e) => handleChange("fontWeight", e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm"
          >
            <option value="light">Light</option>
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="semibold">Semibold</option>
            <option value="bold">Bold</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Text Align</label>
        <select
          value={widget.props?.textAlign || "left"}
          onChange={(e) => handleChange("textAlign", e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
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
