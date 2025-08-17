import type React from "react"
export interface InspectorState {
  selectedWidget: string | null
  activeTab: string
  isVisible: boolean
  propertyValues: Record<string, any>
}

export interface WidgetInspectionConfig {
  widgetType: string
  properties: Record<string, any>
  validation: Record<string, any>
}

export interface PropertyPanelProps {
  widget: any
  onPropertyChange: (key: string, value: any) => void
  onWidgetUpdate: (updates: any) => void
}

export interface InspectorTabConfig {
  id: string
  label: string
  component: React.ComponentType<any>
  icon?: React.ComponentType<any>
}
