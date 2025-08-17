import { z } from "zod"
import type { BaseWidget, ValidationResult, ValidationError } from "../interfaces/base-widget"

export const CommonPropertiesSchema = z
  .object({
    typography: z
      .object({
        family: z.string(),
        weight: z.string(),
        size: z.string(),
        lineHeight: z.string(),
        letterSpacing: z.string(),
        align: z.enum(["left", "center", "right", "justify"]),
        decoration: z.object({
          italic: z.boolean(),
          underline: z.boolean(),
          strike: z.boolean(),
        }),
      })
      .partial(),
    color: z
      .object({
        text: z.string(),
      })
      .partial(),
    background: z
      .object({
        fill: z.string(),
      })
      .partial(),
    layout: z
      .object({
        margin: z.object({ t: z.number(), r: z.number(), b: z.number(), l: z.number() }),
        padding: z.object({ t: z.number(), r: z.number(), b: z.number(), l: z.number() }),
        size: z.object({ w: z.string(), h: z.string() }),
        gap: z.number(),
        direction: z.enum(["row", "column"]),
        alignItems: z.enum(["start", "center", "end", "stretch"]),
        justify: z.enum(["start", "between", "end", "center"]),
      })
      .partial(),
    border: z
      .object({
        preset: z.string(),
        width: z.number(),
        style: z.string(),
        color: z.string(),
        radius: z.string(),
      })
      .partial(),
    appearance: z
      .object({
        opacity: z.number().min(0).max(1),
      })
      .partial(),
    shadow: z
      .object({
        preset: z.string(),
      })
      .partial(),
  })
  .partial()

export const WidgetMetadataSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  author: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const BaseWidgetSchema = z.object({
  id: z.string().uuid(),
  type: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  props: z.record(z.any()),
  children: z.array(z.lazy(() => BaseWidgetSchema)).optional(),
  metadata: WidgetMetadataSchema.optional(),
  style: CommonPropertiesSchema.optional(),
})

export class WidgetValidator {
  private static schemaRegistry = new Map<string, z.ZodSchema>()

  static registerSchema(type: string, schema: z.ZodSchema): void {
    this.schemaRegistry.set(type, schema)
  }

  static getSchema(type: string): z.ZodSchema | null {
    return this.schemaRegistry.get(type) || null
  }

  static validate<T extends BaseWidget>(widget: unknown, schema?: z.ZodSchema<T>): ValidationResult<T> {
    try {
      const validationSchema = schema || this.getSchema((widget as any)?.type) || BaseWidgetSchema
      const validated = validationSchema.parse(widget)
      return { success: true, data: validated as T }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
          code: e.code,
        }))
        return { success: false, errors }
      }
      return {
        success: false,
        errors: [{ path: "root", message: "Unknown validation error", code: "unknown" }],
      }
    }
  }

  static validateWidget(widget: unknown): ValidationResult<BaseWidget> {
    return this.validate(widget, BaseWidgetSchema)
  }

  static validateWidgetArray(widgets: unknown[]): ValidationResult<BaseWidget[]> {
    const results = widgets.map((widget) => this.validateWidget(widget))
    const errors = results.flatMap((result) => result.errors || [])

    if (errors.length > 0) {
      return { success: false, errors }
    }

    return {
      success: true,
      data: results.map((result) => result.data!).filter(Boolean),
    }
  }
}
