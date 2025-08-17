"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SelectInput, TextInput, AlignmentButtons } from "../shared/inputs"

interface DivPropertyPanelProps {
  widget?: any
  props: any
  onChange: (key: string, value: any) => void
}

export function DivPropertyPanel({ widget, props, onChange }: DivPropertyPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Typography: true,
    Color: true,
    Background: true,
    Layout: true,
    Size: true,
    Border: true,
    Appearance: true,
    Shadow: true,
  })

  const actualProps = props || widget?.props || {}

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  if (!props && !widget?.props) {
    return <div className="p-4 text-sm text-gray-500">No widget selected</div>
  }

  return (
    <div className="bg-white border-l border-gray-200 w-80 h-full overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-3">
        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="chat" className="text-xs">
              Chat
            </TabsTrigger>
            <TabsTrigger value="design" className="text-xs">
              Design
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
            section
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Property Sections */}
      <div className="p-3 space-y-1">
        {/* Typography */}
        <Collapsible open={openSections.Typography} onOpenChange={() => toggleSection("Typography")}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Typography
              {openSections.Typography ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-3">
            <div className="space-y-3">
              <SelectInput
                label=""
                value={actualProps.fontFamily || "Default"}
                onChange={(value) => onChange("fontFamily", value)}
                options={[
                  { label: "Default", value: "Default" },
                  { label: "Inter", value: "Inter" },
                  { label: "Roboto", value: "Roboto" },
                ]}
              />

              <div className="grid grid-cols-2 gap-2">
                <SelectInput
                  label=""
                  value={actualProps.fontWeight || "Regular"}
                  onChange={(value) => onChange("fontWeight", value)}
                  options={[
                    { label: "Regular", value: "Regular" },
                    { label: "Medium", value: "Medium" },
                    { label: "Semibold", value: "Semibold" },
                    { label: "Bold", value: "Bold" },
                  ]}
                />
                <SelectInput
                  label=""
                  value={actualProps.fontSize || "Default"}
                  onChange={(value) => onChange("fontSize", value)}
                  options={[
                    { label: "Default", value: "Default" },
                    { label: "Small", value: "Small" },
                    { label: "Large", value: "Large" },
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Line Height</div>
                  <TextInput
                    label=""
                    value={actualProps.lineHeight || "1.75rem"}
                    onChange={(value) => onChange("lineHeight", value)}
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Letter Spacing</div>
                  <TextInput
                    label=""
                    value={actualProps.letterSpacing || "0em"}
                    onChange={(value) => onChange("letterSpacing", value)}
                  />
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-2">Alignment</div>
                <AlignmentButtons
                  value={actualProps.textAlign || "left"}
                  onChange={(value) => onChange("textAlign", value)}
                  type="text"
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-2">Decoration</div>
                <AlignmentButtons
                  value={actualProps.textDecoration || "none"}
                  onChange={(value) => onChange("textDecoration", value)}
                  type="decoration"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Color */}
        <Collapsible open={openSections.Color} onOpenChange={() => toggleSection("Color")}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Color
              {openSections.Color ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-3">
            <SelectInput
              label=""
              value={actualProps.color || "Default"}
              onChange={(value) => onChange("color", value)}
              options={[
                { label: "Default", value: "Default" },
                { label: "Primary", value: "Primary" },
                { label: "Secondary", value: "Secondary" },
              ]}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Background */}
        <Collapsible open={openSections.Background} onOpenChange={() => toggleSection("Background")}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Background
              {openSections.Background ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-3">
            <SelectInput
              label=""
              value={actualProps.background || "Default"}
              onChange={(value) => onChange("background", value)}
              options={[
                { label: "Default", value: "Default" },
                { label: "Primary", value: "Primary" },
                { label: "Secondary", value: "Secondary" },
              ]}
            />
          </CollapsibleContent>
        </Collapsible>

        {/* Layout */}
        <Collapsible open={openSections.Layout} onOpenChange={() => toggleSection("Layout")}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Layout
              {openSections.Layout ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-3">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-2">Direction</div>
                <div className="flex gap-1">
                  <Button
                    variant={actualProps.direction === "row" ? "default" : "outline"}
                    size="sm"
                    className="h-8 flex-1 text-xs"
                    onClick={() => onChange("direction", "row")}
                  >
                    →
                  </Button>
                  <Button
                    variant={actualProps.direction === "column" ? "default" : "outline"}
                    size="sm"
                    className="h-8 flex-1 text-xs"
                    onClick={() => onChange("direction", "column")}
                  >
                    ↓
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-2">Alignment</div>
                <AlignmentButtons
                  value={actualProps.alignItems || "start"}
                  onChange={(value) => onChange("alignItems", value)}
                  type="flex"
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-1">Justification</div>
                <SelectInput
                  label=""
                  value={actualProps.justifyContent || "Default"}
                  onChange={(value) => onChange("justifyContent", value)}
                  options={[
                    { label: "Default", value: "Default" },
                    { label: "Start", value: "Start" },
                    { label: "Center", value: "Center" },
                    { label: "End", value: "End" },
                  ]}
                />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-1">Gap</div>
                <TextInput label="" value={actualProps.gap || "0px"} onChange={(value) => onChange("gap", value)} />
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-2">Margin</div>
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    label=""
                    value={actualProps.marginTop || "0px"}
                    onChange={(value) => onChange("marginTop", value)}
                    placeholder="0px"
                  />
                  <TextInput
                    label=""
                    value={actualProps.marginRight || "0px"}
                    onChange={(value) => onChange("marginRight", value)}
                    placeholder="0px"
                  />
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-600 mb-2">Padding</div>
                <div className="grid grid-cols-2 gap-2">
                  <TextInput
                    label=""
                    value={actualProps.paddingTop || "0px"}
                    onChange={(value) => onChange("paddingTop", value)}
                    placeholder="0px"
                  />
                  <TextInput
                    label=""
                    value={actualProps.paddingRight || "0px"}
                    onChange={(value) => onChange("paddingRight", value)}
                    placeholder="0px"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Size */}
        <Collapsible open={openSections.Size} onOpenChange={() => toggleSection("Size")}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Size
              {openSections.Size ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                label=""
                value={actualProps.width || "100%"}
                onChange={(value) => onChange("width", value)}
                placeholder="100%"
              />
              <TextInput
                label=""
                value={actualProps.height || "auto"}
                onChange={(value) => onChange("height", value)}
                placeholder="auto"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Border */}
        <Collapsible open={openSections.Border} onOpenChange={() => toggleSection("Border")}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Border
              {openSections.Border ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-3">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <SelectInput
                  label=""
                  value={actualProps.borderStyle || "Default"}
                  onChange={(value) => onChange("borderStyle", value)}
                  options={[
                    { label: "Default", value: "Default" },
                    { label: "Solid", value: "Solid" },
                    { label: "Dashed", value: "Dashed" },
                  ]}
                />
                <SelectInput
                  label=""
                  value={actualProps.borderColor || "Default"}
                  onChange={(value) => onChange("borderColor", value)}
                  options={[
                    { label: "Default", value: "Default" },
                    { label: "Primary", value: "Primary" },
                    { label: "Secondary", value: "Secondary" },
                  ]}
                />
              </div>
              <TextInput
                label=""
                value={actualProps.borderWidth || "0px"}
                onChange={(value) => onChange("borderWidth", value)}
                placeholder="0px"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Appearance */}
        <Collapsible open={openSections.Appearance} onOpenChange={() => toggleSection("Appearance")}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Appearance
              {openSections.Appearance ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-3">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-1">Opacity</div>
                <div className="flex items-center gap-2">
                  <TextInput
                    label=""
                    value={actualProps.opacity || "100"}
                    onChange={(value) => onChange("opacity", value)}
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Radius</div>
                <SelectInput
                  label=""
                  value={actualProps.borderRadius || "Default"}
                  onChange={(value) => onChange("borderRadius", value)}
                  options={[
                    { label: "Default", value: "Default" },
                    { label: "Small", value: "Small" },
                    { label: "Medium", value: "Medium" },
                    { label: "Large", value: "Large" },
                  ]}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Shadow */}
        <Collapsible open={openSections.Shadow} onOpenChange={() => toggleSection("Shadow")}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-8 px-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Shadow
              {openSections.Shadow ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-2 pb-3">
            <SelectInput
              label=""
              value={actualProps.shadow || "Default"}
              onChange={(value) => onChange("shadow", value)}
              options={[
                { label: "Default", value: "Default" },
                { label: "Small", value: "Small" },
                { label: "Medium", value: "Medium" },
                { label: "Large", value: "Large" },
              ]}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
