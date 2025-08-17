import type { z } from "zod"
import type { BaseWidget, CommonProperties } from "../core/interfaces/base-widget"

// Strict widget type definitions
export interface StrictWidgetDefinition<TProps = Record<string, any>, TWidget extends BaseWidget = BaseWidget> {
  readonly type: string
  readonly name: string
  readonly description: string
  readonly category: WidgetCategory
  readonly subcategory?: string
  readonly icon: string
  readonly version: string
  readonly defaultProps: TProps
  readonly defaultStyle?: Partial<CommonProperties>
  readonly propertySchema: readonly PropertyField<TProps>[]
  readonly schema: z.ZodSchema<TWidget>
  readonly create: (props?: Partial<TProps>) => TWidget
}

// Widget categories with strict typing
export type WidgetCategory = "atom" | "molecule" | "organism" | "template"

// Property field types with strict generics
export interface PropertyField<TProps = Record<string, any>> {
  readonly key: keyof TProps
  readonly label: string
  readonly type: PropertyFieldType
  readonly options?: readonly string[]
  readonly min?: number
  readonly max?: number
  readonly step?: number
  readonly section?: PropertySection
  readonly required?: boolean
  readonly defaultValue?: TProps[keyof TProps]
  readonly description?: string
  readonly dependsOn?: keyof TProps
  readonly validator?: (value: any) => boolean
  readonly transformer?: (value: any) => TProps[keyof TProps]
}

export type PropertyFieldType =
  | "text"
  | "number"
  | "color"
  | "select"
  | "toggle"
  | "textarea"
  | "url"
  | "email"
  | "date"
  | "range"
  | "file"

export type PropertySection =
  | "content"
  | "appearance"
  | "layout"
  | "behavior"
  | "state"
  | "validation"
  | "form"
  | "semantic"

// Specific widget prop types
export interface ButtonProps {
  readonly text: string
  readonly variant: "primary" | "secondary" | "outline" | "ghost"
  readonly size: "sm" | "md" | "lg"
  readonly disabled: boolean
  readonly loading: boolean
  readonly icon?: string
  readonly href?: string
  readonly target?: "_self" | "_blank" | "_parent" | "_top"
  readonly onClick?: string
}

export interface InputProps {
  readonly type: "text" | "email" | "password" | "number" | "tel" | "url" | "search"
  readonly placeholder?: string
  readonly value: string
  readonly name?: string
  readonly id?: string
  readonly required: boolean
  readonly disabled: boolean
  readonly readonly: boolean
  readonly minLength?: number
  readonly maxLength?: number
  readonly pattern?: string
}

export interface HeadingProps {
  readonly content: string
  readonly level: 1 | 2 | 3 | 4 | 5 | 6
  readonly tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export interface TextProps {
  readonly content: string
  readonly tag?: "span" | "p" | "div"
}

export interface ImageProps {
  readonly src: string
  readonly alt: string
  readonly width?: number
  readonly height?: number
  readonly loading: "lazy" | "eager"
  readonly objectFit: "contain" | "cover" | "fill" | "none" | "scale-down"
}

export interface LinkProps {
  readonly href: string
  readonly text: string
  readonly target: "_self" | "_blank" | "_parent" | "_top"
  readonly rel?: string
  readonly title?: string
}

// Typed widget interfaces
export interface ButtonWidget extends BaseWidget {
  readonly type: "button"
  readonly props: ButtonProps
}

export interface InputWidget extends BaseWidget {
  readonly type: "input"
  readonly props: InputProps
}

export interface HeadingWidget extends BaseWidget {
  readonly type: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "heading"
  readonly props: HeadingProps
}

export interface TextWidget extends BaseWidget {
  readonly type: "span" | "p" | "text"
  readonly props: TextProps
}

export interface ImageWidget extends BaseWidget {
  readonly type: "img"
  readonly props: ImageProps
}

export interface LinkWidget extends BaseWidget {
  readonly type: "link"
  readonly props: LinkProps
}

// Union type for all widgets
export type AnyWidget = ButtonWidget | InputWidget | HeadingWidget | TextWidget | ImageWidget | LinkWidget

// Widget registry type
export interface WidgetRegistry {
  readonly [type: string]: StrictWidgetDefinition
}

// Type guards
export const isButtonWidget = (widget: BaseWidget): widget is ButtonWidget => widget.type === "button"

export const isInputWidget = (widget: BaseWidget): widget is InputWidget => widget.type === "input"

export const isHeadingWidget = (widget: BaseWidget): widget is HeadingWidget =>
  ["h1", "h2", "h3", "h4", "h5", "h6", "heading"].includes(widget.type)

export const isTextWidget = (widget: BaseWidget): widget is TextWidget => ["span", "p", "text"].includes(widget.type)

export const isImageWidget = (widget: BaseWidget): widget is ImageWidget => widget.type === "img"

export const isLinkWidget = (widget: BaseWidget): widget is LinkWidget => widget.type === "link"

// Utility types
export type WidgetType = AnyWidget["type"]
export type WidgetPropsFor<T extends WidgetType> = Extract<AnyWidget, { type: T }>["props"]
export type WidgetFor<T extends WidgetType> = Extract<AnyWidget, { type: T }>

// Generic widget creation function type
export type WidgetCreator<TProps, TWidget extends BaseWidget> = (props?: Partial<TProps>) => TWidget

// Property validation function type
export type PropertyValidator<T = any> = (value: T) => boolean | string

// Widget transformation function type
export type WidgetTransformer<TFrom extends BaseWidget, TTo extends BaseWidget> = (widget: TFrom) => TTo
