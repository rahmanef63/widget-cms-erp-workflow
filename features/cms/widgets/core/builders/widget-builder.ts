import { v4 as uuidv4 } from "uuid"
import type { BaseWidget, CommonProperties, ValidationResult } from "../interfaces/base-widget"
import { WidgetValidator } from "../validation/widget-validator"
import { SchemaRegistry } from "../validation/schema-registry"
import { WidgetValidationError } from "../validation/validation-errors"

export class WidgetBuilder<T extends BaseWidget = BaseWidget> {
  private widget: Partial<T>

  constructor(type: string) {
    this.widget = {
      id: uuidv4(),
      type,
      version: "1.0.0",
      props: {},
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    } as Partial<T>
  }

  // Property methods
  addProp<K extends keyof T["props"]>(key: K, value: T["props"][K]): this {
    if (!this.widget.props) {
      this.widget.props = {}
    }
    this.widget.props[key] = value
    this.updateTimestamp()
    return this
  }

  addProps(props: Partial<T["props"]>): this {
    if (!this.widget.props) {
      this.widget.props = {}
    }
    Object.assign(this.widget.props, props)
    this.updateTimestamp()
    return this
  }

  removeProp<K extends keyof T["props"]>(key: K): this {
    if (this.widget.props) {
      delete this.widget.props[key]
      this.updateTimestamp()
    }
    return this
  }

  // Style methods
  addStyle(style: Partial<CommonProperties>): this {
    if (!this.widget.style) {
      this.widget.style = {}
    }
    Object.assign(this.widget.style, style)
    this.updateTimestamp()
    return this
  }

  addClass(className: string): this {
    if (!this.widget.props) {
      this.widget.props = {}
    }
    const currentClass = this.widget.props.className || ""
    const classes = currentClass.split(" ").filter(Boolean)
    if (!classes.includes(className)) {
      classes.push(className)
      this.widget.props.className = classes.join(" ")
      this.updateTimestamp()
    }
    return this
  }

  removeClass(className: string): this {
    if (!this.widget.props?.className) return this
    const classes = this.widget.props.className.split(" ").filter(Boolean)
    const filteredClasses = classes.filter((cls: string) => cls !== className)
    this.widget.props.className = filteredClasses.join(" ")
    this.updateTimestamp()
    return this
  }

  // Children methods
  addChild(child: BaseWidget): this {
    if (!this.widget.children) {
      this.widget.children = []
    }
    this.widget.children.push(child)
    this.updateTimestamp()
    return this
  }

  addChildren(children: BaseWidget[]): this {
    if (!this.widget.children) {
      this.widget.children = []
    }
    this.widget.children.push(...children)
    this.updateTimestamp()
    return this
  }

  removeChild(childId: string): this {
    if (this.widget.children) {
      this.widget.children = this.widget.children.filter((child) => child.id !== childId)
      this.updateTimestamp()
    }
    return this
  }

  clearChildren(): this {
    this.widget.children = []
    this.updateTimestamp()
    return this
  }

  // Metadata methods
  setAuthor(author: string): this {
    if (!this.widget.metadata) {
      this.widget.metadata = {
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    this.widget.metadata.author = author
    this.updateTimestamp()
    return this
  }

  setDescription(description: string): this {
    if (!this.widget.metadata) {
      this.widget.metadata = {
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    this.widget.metadata.description = description
    this.updateTimestamp()
    return this
  }

  addTag(tag: string): this {
    if (!this.widget.metadata) {
      this.widget.metadata = {
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    if (!this.widget.metadata.tags) {
      this.widget.metadata.tags = []
    }
    if (!this.widget.metadata.tags.includes(tag)) {
      this.widget.metadata.tags.push(tag)
      this.updateTimestamp()
    }
    return this
  }

  // Validation methods
  validate(): ValidationResult<T> {
    const registry = SchemaRegistry.getInstance()
    const schema = registry.get(this.widget.type!)
    return WidgetValidator.validate(this.widget, schema)
  }

  isValid(): boolean {
    return this.validate().success
  }

  // Build methods
  build(): T {
    const validation = this.validate()
    if (!validation.success) {
      throw new WidgetValidationError(validation.errors!)
    }
    return validation.data as T
  }

  buildUnsafe(): T {
    return this.widget as T
  }

  // Utility methods
  clone(): WidgetBuilder<T> {
    const cloned = new WidgetBuilder<T>(this.widget.type!)
    cloned.widget = JSON.parse(JSON.stringify(this.widget))
    cloned.widget.id = uuidv4() // Generate new ID for clone
    return cloned
  }

  toJSON(): Partial<T> {
    return JSON.parse(JSON.stringify(this.widget))
  }

  private updateTimestamp(): void {
    if (!this.widget.metadata) {
      this.widget.metadata = {
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    } else {
      this.widget.metadata.updatedAt = new Date()
    }
  }

  // Static factory methods
  static fromWidget<T extends BaseWidget>(widget: T): WidgetBuilder<T> {
    const builder = new WidgetBuilder<T>(widget.type)
    builder.widget = { ...widget }
    return builder
  }

  static fromJSON<T extends BaseWidget>(json: string): WidgetBuilder<T> {
    const widget = JSON.parse(json) as T
    return WidgetBuilder.fromWidget(widget)
  }
}
