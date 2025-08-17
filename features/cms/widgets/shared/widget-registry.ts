import type { StrictWidgetDefinition, WidgetType, WidgetFor } from "./widget-types"
import type { BaseWidget } from "../core/interfaces/base-widget"

export class TypedWidgetRegistry {
  private static instance: TypedWidgetRegistry
  private readonly registry = new Map<WidgetType, StrictWidgetDefinition<any, any>>()

  private constructor() {}

  static getInstance(): TypedWidgetRegistry {
    if (!TypedWidgetRegistry.instance) {
      TypedWidgetRegistry.instance = new TypedWidgetRegistry()
    }
    return TypedWidgetRegistry.instance
  }

  register<T extends WidgetType>(
    type: T,
    definition: StrictWidgetDefinition<WidgetFor<T>["props"], WidgetFor<T>>,
  ): void {
    this.registry.set(type, definition)
  }

  get<T extends WidgetType>(type: T): StrictWidgetDefinition<WidgetFor<T>["props"], WidgetFor<T>> | null {
    return this.registry.get(type) as StrictWidgetDefinition<WidgetFor<T>["props"], WidgetFor<T>> | null
  }

  has(type: WidgetType): boolean {
    return this.registry.has(type)
  }

  getAll(): ReadonlyMap<WidgetType, StrictWidgetDefinition<any, any>> {
    return new Map(this.registry)
  }

  getByCategory(category: string): StrictWidgetDefinition<any, any>[] {
    return Array.from(this.registry.values()).filter((def) => def.category === category)
  }

  create<T extends WidgetType>(type: T, props?: Partial<WidgetFor<T>["props"]>): WidgetFor<T> | null {
    const definition = this.get(type)
    if (!definition) {
      return null
    }
    return definition.create(props)
  }

  validate<T extends WidgetType>(type: T, widget: BaseWidget): widget is WidgetFor<T> {
    const definition = this.get(type)
    if (!definition) {
      return false
    }

    try {
      definition.schema.parse(widget)
      return true
    } catch {
      return false
    }
  }

  getTypes(): readonly WidgetType[] {
    return Array.from(this.registry.keys())
  }

  clear(): void {
    this.registry.clear()
  }
}

// Singleton instance
export const widgetRegistry = TypedWidgetRegistry.getInstance()
