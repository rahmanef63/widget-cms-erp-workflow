import { z } from "zod"
import { BaseWidgetSchema } from "./widget-validator"

export const ButtonWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal("button"),
  props: z.object({
    text: z.string().min(1, "Button text is required"),
    variant: z.enum(["primary", "secondary", "outline", "ghost"]).default("primary"),
    size: z.enum(["sm", "md", "lg"]).default("md"),
    disabled: z.boolean().default(false),
    loading: z.boolean().default(false),
    icon: z.string().optional(),
    href: z.string().url().optional(),
    target: z.enum(["_self", "_blank", "_parent", "_top"]).optional(),
    onClick: z.string().optional(), // Event handler as string for serialization
  }),
})

export const InputWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal("input"),
  props: z.object({
    type: z.enum(["text", "email", "password", "number", "tel", "url", "search"]).default("text"),
    placeholder: z.string().optional(),
    value: z.string().default(""),
    required: z.boolean().default(false),
    disabled: z.boolean().default(false),
    readonly: z.boolean().default(false),
    minLength: z.number().min(0).optional(),
    maxLength: z.number().min(1).optional(),
    pattern: z.string().optional(),
    name: z.string().optional(),
    id: z.string().optional(),
  }),
})

export const TextWidgetSchema = BaseWidgetSchema.extend({
  type: z.enum(["span", "p", "h1", "h2", "h3", "h4", "h5", "h6"]),
  props: z.object({
    content: z.string().min(1, "Text content is required"),
    tag: z.enum(["span", "p", "h1", "h2", "h3", "h4", "h5", "h6"]).optional(),
  }),
})

export const ImageWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal("img"),
  props: z.object({
    src: z.string().url("Invalid image URL"),
    alt: z.string().min(1, "Alt text is required for accessibility"),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
    loading: z.enum(["lazy", "eager"]).default("lazy"),
    objectFit: z.enum(["contain", "cover", "fill", "none", "scale-down"]).default("cover"),
  }),
})

export const LinkWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal("link"),
  props: z.object({
    href: z.string().url("Invalid URL"),
    text: z.string().min(1, "Link text is required"),
    target: z.enum(["_self", "_blank", "_parent", "_top"]).default("_self"),
    rel: z.string().optional(),
    title: z.string().optional(),
  }),
})

export class SchemaRegistry {
  private static instance: SchemaRegistry
  private schemas = new Map<string, z.ZodSchema>()

  private constructor() {
    this.registerDefaultSchemas()
  }

  static getInstance(): SchemaRegistry {
    if (!SchemaRegistry.instance) {
      SchemaRegistry.instance = new SchemaRegistry()
    }
    return SchemaRegistry.instance
  }

  private registerDefaultSchemas(): void {
    this.schemas.set("button", ButtonWidgetSchema)
    this.schemas.set("input", InputWidgetSchema)
    this.schemas.set("span", TextWidgetSchema)
    this.schemas.set("p", TextWidgetSchema)
    this.schemas.set("h1", TextWidgetSchema)
    this.schemas.set("h2", TextWidgetSchema)
    this.schemas.set("h3", TextWidgetSchema)
    this.schemas.set("img", ImageWidgetSchema)
    this.schemas.set("link", LinkWidgetSchema)
  }

  register(type: string, schema: z.ZodSchema): void {
    this.schemas.set(type, schema)
  }

  get(type: string): z.ZodSchema | null {
    return this.schemas.get(type) || null
  }

  getAll(): Map<string, z.ZodSchema> {
    return new Map(this.schemas)
  }

  has(type: string): boolean {
    return this.schemas.has(type)
  }
}
