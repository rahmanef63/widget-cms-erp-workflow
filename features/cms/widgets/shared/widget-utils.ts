import type { AnyWidget, WidgetType, WidgetFor, PropertyField, PropertyValidator } from "./widget-types"
import type { BaseWidget } from "../core/interfaces/base-widget"

// Utility functions with strict typing
export class WidgetUtils {
  static getWidgetType<T extends BaseWidget>(widget: T): T["type"] {
    return widget.type
  }

  static getWidgetProps<T extends AnyWidget>(widget: T): T["props"] {
    return widget.props
  }

  static updateWidgetProps<T extends AnyWidget>(widget: T, updates: Partial<T["props"]>): T {
    return {
      ...widget,
      props: {
        ...widget.props,
        ...updates,
      },
      metadata: {
        ...widget.metadata,
        updatedAt: new Date(),
      },
    } as T
  }

  static cloneWidget<T extends AnyWidget>(widget: T): T {
    return JSON.parse(JSON.stringify(widget)) as T
  }

  static isWidgetOfType<T extends WidgetType>(widget: BaseWidget, type: T): widget is WidgetFor<T> {
    return widget.type === type
  }

  static validateProperty<T>(value: T, field: PropertyField, validator?: PropertyValidator<T>): boolean | string {
    // Required field validation
    if (field.required && (value === undefined || value === null || value === "")) {
      return `${field.label} is required`
    }

    // Type-specific validation
    switch (field.type) {
      case "number":
        if (typeof value !== "number") return `${field.label} must be a number`
        if (field.min !== undefined && value < field.min) {
          return `${field.label} must be at least ${field.min}`
        }
        if (field.max !== undefined && value > field.max) {
          return `${field.label} must be at most ${field.max}`
        }
        break

      case "text":
      case "textarea":
        if (typeof value !== "string") return `${field.label} must be text`
        if (field.min !== undefined && value.length < field.min) {
          return `${field.label} must be at least ${field.min} characters`
        }
        if (field.max !== undefined && value.length > field.max) {
          return `${field.label} must be at most ${field.max} characters`
        }
        break

      case "email":
        if (typeof value !== "string") return `${field.label} must be text`
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return `${field.label} must be a valid email`
        break

      case "url":
        if (typeof value !== "string") return `${field.label} must be text`
        try {
          new URL(value)
        } catch {
          return `${field.label} must be a valid URL`
        }
        break

      case "select":
        if (field.options && !field.options.includes(String(value))) {
          return `${field.label} must be one of: ${field.options.join(", ")}`
        }
        break

      case "toggle":
        if (typeof value !== "boolean") return `${field.label} must be true or false`
        break

      case "color":
        if (typeof value !== "string") return `${field.label} must be text`
        const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
        if (!colorRegex.test(value)) return `${field.label} must be a valid hex color`
        break
    }

    // Custom validator
    if (validator) {
      const result = validator(value)
      if (result !== true) {
        return typeof result === "string" ? result : `${field.label} is invalid`
      }
    }

    return true
  }

  static getPropertyValue<T extends AnyWidget, K extends keyof T["props"]>(widget: T, key: K): T["props"][K] {
    return widget.props[key]
  }

  static setPropertyValue<T extends AnyWidget, K extends keyof T["props"]>(widget: T, key: K, value: T["props"][K]): T {
    return this.updateWidgetProps(widget, { [key]: value } as Partial<T["props"]>)
  }

  static hasProperty<T extends AnyWidget>(widget: T, key: keyof T["props"]): boolean {
    return key in widget.props
  }

  static getWidgetsByType<T extends WidgetType>(widgets: BaseWidget[], type: T): WidgetFor<T>[] {
    return widgets.filter((widget): widget is WidgetFor<T> => this.isWidgetOfType(widget, type))
  }

  static findWidget<T extends AnyWidget>(
    widgets: BaseWidget[],
    predicate: (widget: BaseWidget) => widget is T,
  ): T | undefined {
    return widgets.find(predicate)
  }

  static findWidgetById<T extends AnyWidget = AnyWidget>(widgets: BaseWidget[], id: string): T | undefined {
    return widgets.find((widget) => widget.id === id) as T | undefined
  }

  static filterWidgets<T extends AnyWidget>(
    widgets: BaseWidget[],
    predicate: (widget: BaseWidget) => widget is T,
  ): T[] {
    return widgets.filter(predicate)
  }

  static mapWidgets<T extends AnyWidget, R>(widgets: T[], mapper: (widget: T) => R): R[] {
    return widgets.map(mapper)
  }
}
