"use client"

import type React from "react"
import type { AnyWidget, WidgetType } from "./widget-types"
import { ButtonPropertyPanel } from "../atoms/button/PropertyPanel"
import { InputPropertyPanel } from "../atoms/input/PropertyPanel"
import { TextPropertyPanel } from "../atoms/text/PropertyPanel"
import { LabelPropertyInspector } from "./inputs/shadcn/label"
import { TextareaPropertyInspector } from "./inputs/shadcn/textarea"
import { CheckboxPropertyInspector } from "./inputs/shadcn/checkbox"
import { SelectPropertyInspector } from "./inputs/shadcn/select"
import { SwitchPropertyInspector } from "./inputs/shadcn/switch"
import { RadioGroupPropertyInspector } from "./inputs/shadcn/radio-group"
import { InputOTPPropertyInspector } from "./inputs/shadcn/input-otp"

type PropertyPanelComponent<T extends AnyWidget = AnyWidget> = React.ComponentType<{
  widget: T
  onChange: (widget: T) => void
}>

export class PropertyPanelRegistry {
  private static instance: PropertyPanelRegistry
  private readonly panels = new Map<WidgetType, PropertyPanelComponent<any>>()

  private constructor() {
    this.registerDefaultPanels()
  }

  static getInstance(): PropertyPanelRegistry {
    if (!PropertyPanelRegistry.instance) {
      PropertyPanelRegistry.instance = new PropertyPanelRegistry()
    }
    return PropertyPanelRegistry.instance
  }

  register<T extends WidgetType>(type: T, component: PropertyPanelComponent<any>): void {
    this.panels.set(type, component)
  }

  get<T extends WidgetType>(type: T): PropertyPanelComponent<any> | null {
    return this.panels.get(type) || null
  }

  has(type: WidgetType): boolean {
    return this.panels.has(type)
  }

  renderPanel<T extends AnyWidget>(widget: T, onChange: (widget: T) => void): React.ReactElement | null {
    const PanelComponent = this.get(widget.type)
    if (!PanelComponent) {
      return null
    }
    return <PanelComponent widget={widget} onChange={onChange} />
  }

  private registerDefaultPanels(): void {
    this.register("button", ButtonPropertyPanel)
    this.register("input", InputPropertyPanel)
    this.register("text", TextPropertyPanel)
    this.register("h1", TextPropertyPanel)
    this.register("h2", TextPropertyPanel)
    this.register("h3", TextPropertyPanel)
    this.register("heading", TextPropertyPanel)
    this.register("shadcn-label", LabelPropertyInspector)
    this.register("shadcn-textarea", TextareaPropertyInspector)
    this.register("shadcn-checkbox", CheckboxPropertyInspector)
    this.register("shadcn-select", SelectPropertyInspector)
    this.register("shadcn-switch", SwitchPropertyInspector)
    this.register("shadcn-radio-group", RadioGroupPropertyInspector)
    this.register("shadcn-input-otp", InputOTPPropertyInspector)
  }
}

export const propertyPanelRegistry = PropertyPanelRegistry.getInstance()
