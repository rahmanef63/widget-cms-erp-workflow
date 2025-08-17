"use client"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Italic,
  Underline,
  Strikethrough,
  MoreHorizontal,
} from "lucide-react"
import { createPropertySetter } from "@/features/cms/lib/inspector-helpers"

interface TextWidgetTabProps {
  selected: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
}

export function TextWidgetTab({ selected, onChange }: TextWidgetTabProps) {
  const setProp = createPropertySetter(onChange)

  return (
    <div className="space-y-3">
      {/* Text Content */}
      <div>
        <div className="text-xs text-gray-500 mb-1">Text Content</div>
        <textarea
          className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={String(selected.data.props.content || "Enter your text here")}
          onChange={(e) => setProp("content", e.target.value)}
          placeholder="Enter your text here"
        />
      </div>

      {/* HTML Tag Selection */}
      <div>
        <div className="text-xs text-gray-500 mb-1">HTML Tag</div>
        <Select value={String(selected.data.props.tag || "div")} onValueChange={(v) => setProp("tag", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="div" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="div">div</SelectItem>
            <SelectItem value="p">p</SelectItem>
            <SelectItem value="h1">h1</SelectItem>
            <SelectItem value="h2">h2</SelectItem>
            <SelectItem value="h3">h3</SelectItem>
            <SelectItem value="h4">h4</SelectItem>
            <SelectItem value="h5">h5</SelectItem>
            <SelectItem value="h6">h6</SelectItem>
            <SelectItem value="span">span</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Font Family */}
      <Select
        value={String(selected.data.props.fontFamily || "Default")}
        onValueChange={(v) => setProp("fontFamily", v)}
      >
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Default">Default</SelectItem>
          <SelectItem value="Inter">Inter</SelectItem>
          <SelectItem value="Roboto">Roboto</SelectItem>
          <SelectItem value="Arial">Arial</SelectItem>
        </SelectContent>
      </Select>

      {/* Font Weight and Size */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          value={String(selected.data.props.fontWeight || "Regular")}
          onValueChange={(v) => setProp("fontWeight", v)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Regular" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Regular">Regular</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Semibold">Semibold</SelectItem>
            <SelectItem value="Bold">Bold</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(selected.data.props.fontSize || "Default")} onValueChange={(v) => setProp("fontSize", v)}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Default" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Default">Default</SelectItem>
            <SelectItem value="Small">Small</SelectItem>
            <SelectItem value="Large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Line Height and Letter Spacing */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">Line Height</div>
          <Input
            className="h-9 text-sm"
            value={String(selected.data.props.lineHeight || "1.75rem")}
            onChange={(e) => setProp("lineHeight", e.target.value)}
            placeholder="1.75rem"
          />
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Letter Spacing</div>
          <Input
            className="h-9 text-sm"
            value={String(selected.data.props.letterSpacing || "0em")}
            onChange={(e) => setProp("letterSpacing", e.target.value)}
            placeholder="0em"
          />
        </div>
      </div>

      {/* Alignment */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Alignment</div>
        <div className="flex gap-1">
          <Button
            variant={selected.data.props.textAlign === "left" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setProp("textAlign", "left")}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={selected.data.props.textAlign === "center" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setProp("textAlign", "center")}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={selected.data.props.textAlign === "right" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setProp("textAlign", "right")}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant={selected.data.props.textAlign === "justify" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setProp("textAlign", "justify")}
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
          <Button
            variant={selected.data.props.textAlign === "distribute" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setProp("textAlign", "distribute")}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Decoration */}
      <div>
        <div className="text-xs text-gray-500 mb-2">Decoration</div>
        <div className="flex gap-1">
          <Button
            variant={selected.data.props.fontStyle === "italic" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setProp("fontStyle", selected.data.props.fontStyle === "italic" ? "normal" : "italic")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={selected.data.props.textDecoration === "line-through" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() =>
              setProp("textDecoration", selected.data.props.textDecoration === "line-through" ? "none" : "line-through")
            }
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant={selected.data.props.textDecoration === "underline" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() =>
              setProp("textDecoration", selected.data.props.textDecoration === "underline" ? "none" : "underline")
            }
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant={selected.data.props.textDecoration === "overline" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() =>
              setProp("textDecoration", selected.data.props.textDecoration === "overline" ? "none" : "overline")
            }
          >
            <span className="text-sm font-bold">O</span>
          </Button>
          <Button
            variant={selected.data.props.textDecoration === "none" ? "default" : "outline"}
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setProp("textDecoration", "none")}
          >
            <span className="text-sm">∅</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
