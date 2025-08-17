"use client"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { propertyPanelRegistry } from "../../widgets/shared/property-panel-registry"
import { useWidgetRegistry } from "../../widgets/hooks/useWidgetRegistry"
import type { AnyWidget, PropertyField } from "../../widgets/shared/widget-types"
import type { BaseWidget } from "../../widgets/core/interfaces/base-widget"
import { useWidgetInspection } from "../../hooks/useWidgetInspection"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

interface WidgetPropertyPanelProps {
  selected: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
  onReorderChildren?: (parentId: string, newOrder: string[]) => void
}

export function WidgetPropertyPanel({ selected, onChange, onReorderChildren: _onReorderChildren }: WidgetPropertyPanelProps) {
  const { inspectionConfig, validateProperty } = useWidgetInspection(selected.id)
  const { getWidget } = useWidgetRegistry()

  // Convert node data to widget format
  const widget: BaseWidget = {
    id: selected.id,
    type: selected.data.type,
    version: "1.0.0",
    props: selected.data.props || {},
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }

  const handleWidgetChange = (updatedWidget: BaseWidget) => {
    const isValid = Object.entries(updatedWidget.props).every(([key, value]) => validateProperty(key, value))

    if (isValid) {
      onChange((data) => ({
        ...data,
        props: updatedWidget.props,
      }))
    }
  }

  const handlePropertyChange = (key: string, value: any) => {
    const updatedWidget = {
      ...widget,
      props: {
        ...widget.props,
        [key]: value
      }
    }
    handleWidgetChange(updatedWidget)
  }

  const validatePropertyField = (field: PropertyField, value: any): string | null => {
    // Simple validation - can be enhanced later
    if (field.required && (value === undefined || value === null || value === '')) {
      return `${field.label} is required`
    }
    return null
  }

  const renderPropertyField = (field: PropertyField) => {
    const value = widget.props[field.key as keyof typeof widget.props]
    const error = validatePropertyField(field, value)
    const isDisabled = Boolean(field.dependsOn && !widget.props.hasOwnProperty(field.dependsOn))
    const fieldId = `${widget.id}-${String(field.key)}`

    switch (field.type) {
      case "text":
      case "email":
      case "url":
        return (
          <div key={String(field.key)} className="space-y-1">
            <Label htmlFor={fieldId} className="text-xs font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type={field.type}
              value={String(value || "")}
              onChange={(e) => handlePropertyChange(field.key, e.target.value)}
              placeholder={field.description || `Enter ${field.label.toLowerCase()}...`}
              disabled={isDisabled}
              className={`h-8 ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            {field.description && !error && <p className="text-xs text-gray-500">{field.description}</p>}
          </div>
        )

      case "number":
      case "range":
        return (
          <div key={String(field.key)} className="space-y-1">
            <Label htmlFor={fieldId} className="text-xs font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type={field.type}
              value={String(value || "")}
              onChange={(e) => handlePropertyChange(field.key, Number(e.target.value))}
              min={field.min}
              max={field.max}
              step={field.step}
              disabled={isDisabled}
              className={`h-8 ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "textarea":
        return (
          <div key={String(field.key)} className="space-y-1">
            <Label htmlFor={fieldId} className="text-xs font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              value={String(value || "")}
              onChange={(e) => handlePropertyChange(field.key, e.target.value)}
              placeholder={field.description || `Enter ${field.label.toLowerCase()}...`}
              disabled={isDisabled}
              rows={3}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "select":
        return (
          <div key={String(field.key)} className="space-y-1">
            <Label htmlFor={fieldId} className="text-xs font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={String(value || field.defaultValue || "")}
              onValueChange={(v) => handlePropertyChange(field.key, v)}
              disabled={isDisabled}
            >
              <SelectTrigger className={`h-8 ${error ? "border-red-500" : ""}`}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      case "toggle":
        return (
          <div key={String(field.key)} className="flex items-center justify-between py-2">
            <Label htmlFor={fieldId} className="text-xs font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Switch
              id={fieldId}
              checked={Boolean(value)}
              onCheckedChange={(checked) => handlePropertyChange(field.key, checked)}
              disabled={isDisabled}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        )

      case "color":
        return (
          <div key={String(field.key)} className="space-y-1">
            <Label htmlFor={fieldId} className="text-xs font-medium">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="flex gap-2">
              <Input
                id={fieldId}
                type="color"
                value={String(value || "#000000")}
                onChange={(e) => handlePropertyChange(field.key, e.target.value)}
                disabled={isDisabled}
                className="h-8 w-12 p-1"
              />
              <Input
                type="text"
                value={String(value || "")}
                onChange={(e) => handlePropertyChange(field.key, e.target.value)}
                placeholder="#000000"
                disabled={isDisabled}
                className={`h-8 flex-1 ${error ? "border-red-500" : ""}`}
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
        )

      default:
        return null
    }
  }

  const renderPropertyPanel = (propertySchema: PropertyField[]) => {
    const groupedFields = propertySchema.reduce(
      (groups, field) => {
        const section = field.section || "general"
        if (!groups[section]) {
          groups[section] = []
        }
        groups[section].push(field)
        return groups
      },
      {} as Record<string, PropertyField[]>,
    )

    return (
      <div className="space-y-4">
        {Object.entries(groupedFields).map(([section, fields]: [string, PropertyField[]]) => (
          <div key={section} className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium capitalize">{section}</h4>
              <Separator className="flex-1" />
            </div>
            <div className="space-y-3">{fields.map(renderPropertyField)}</div>
          </div>
        ))}
      </div>
    )
  }

  // Try to get specific property panel first
  const specificPanel = propertyPanelRegistry.renderPanel(widget as AnyWidget, handleWidgetChange)
  if (specificPanel) {
    return <div className="space-y-3">{specificPanel}</div>
  }

  // Fallback to generic property panel with schema
  const widgetDefinition = getWidget(widget.type)
  if (widgetDefinition && widgetDefinition.propertySchema) {
    return (
      <div className="space-y-3">
        {renderPropertyPanel(widgetDefinition.propertySchema as PropertyField[])}
      </div>
    )
  }

  // Final fallback
  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-500">No property panel available for widget type: {selected.data.type}</div>
      {inspectionConfig && <div className="text-xs text-gray-400 mt-2">Widget Type: {inspectionConfig.widgetType}</div>}
    </div>
  )
}
