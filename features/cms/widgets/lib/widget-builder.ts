import type { BaseWidget } from "../core/interfaces/base-widget"
import type { WidgetComposition, WidgetDefinition } from "../shared/types"

export class WidgetBuilder {
  private widget: Partial<BaseWidget>

  constructor(type: string) {
    this.widget = {
      id: this.generateId(),
      type: type as any,
      version: "1.0.0",
      props: {},
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }
  }

  static create(type: string): WidgetBuilder {
    return new WidgetBuilder(type)
  }

  withId(id: string): WidgetBuilder {
    this.widget.id = id
    return this
  }

  withProps(props: Record<string, any>): WidgetBuilder {
    this.widget.props = { ...this.widget.props, ...props }
    return this
  }

  withVersion(version: string): WidgetBuilder {
    this.widget.version = version
    return this
  }

  withMetadata(metadata: Record<string, any>): WidgetBuilder {
    this.widget.metadata = {
      ...this.widget.metadata,
      ...metadata,
      updatedAt: new Date(),
    }
    return this
  }

  fromDefinition(definition: WidgetDefinition): WidgetBuilder {
    this.widget.props = { ...definition.defaultProps }
    this.widget.version = definition.version
    return this
  }

  fromComposition(composition: WidgetComposition): WidgetBuilder {
    this.widget.type = composition.type as any
    this.widget.props = { ...composition.props }
    return this
  }

  build(): BaseWidget {
    if (!this.widget.id || !this.widget.type) {
      throw new Error("Widget must have id and type")
    }

    return this.widget as BaseWidget
  }

  private generateId(): string {
    return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
