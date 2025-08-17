import type { BaseWidget } from "../interfaces/base-widget"
import { WidgetBuilderCore as WidgetBuilder } from "./widget-builder-core"
import { trackImport, withErrorHandling, DebugLogger } from "./debug-logger"

trackImport("WidgetBuilderCore", "composition-builder.ts")

export interface CompositionPattern {
  name: string
  description: string
  create: () => BaseWidget
}

export class CompositionBuilder {
  private patterns = new Map<string, CompositionPattern>()
  private logger = DebugLogger.getInstance()

  constructor() {
    this.logger.info("CompositionBuilder initialized")
  }

  // Register composition patterns
  registerPattern(pattern: CompositionPattern): this {
    return (
      withErrorHandling(() => {
        this.patterns.set(pattern.name, pattern)
        this.logger.info(`Registered pattern: ${pattern.name}`)
        return this
      }, "registerPattern") || this
    )
  }

  // Create widget from pattern
  createFromPattern(patternName: string): BaseWidget {
    return (
      withErrorHandling(() => {
        const pattern = this.patterns.get(patternName)
        if (!pattern) {
          throw new Error(`Composition pattern '${patternName}' not found`)
        }
        this.logger.info(`Creating widget from pattern: ${patternName}`)
        return pattern.create()
      }, "createFromPattern") || this.createErrorWidget(`Pattern '${patternName}' not found`)
    )
  }

  // Get all available patterns
  getPatterns(): CompositionPattern[] {
    return Array.from(this.patterns.values())
  }

  private createErrorWidget(message: string): BaseWidget {
    this.logger.error(`Creating error widget: ${message}`)
    return new WidgetBuilder("div")
      .addClass("error-widget bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded")
      .addProp("content", `Error: ${message}`)
      .build()
  }

  // Common composition patterns
  static createCard(title: string, content: string, actions?: BaseWidget[]): BaseWidget {
    return (
      withErrorHandling(() => {
        const logger = DebugLogger.getInstance()
        logger.info("Creating card widget", { title, content })

        const cardBuilder = new WidgetBuilder("div")
          .addClass("card bg-white rounded-lg shadow-md p-6")
          .addChild(new WidgetBuilder("h3").addProp("content", title).addClass("text-lg font-semibold mb-2").build())
          .addChild(new WidgetBuilder("p").addProp("content", content).addClass("text-gray-600 mb-4").build())

        if (actions && actions.length > 0) {
          const actionsContainer = new WidgetBuilder("div")
            .addClass("flex gap-2 justify-end")
            .addChildren(actions)
            .build()
          cardBuilder.addChild(actionsContainer)
        }

        return cardBuilder.build()
      }, "CompositionBuilder.createCard") || new WidgetBuilder("div").addProp("content", "Error creating card").build()
    )
  }

  static createButton(text: string, variant: "primary" | "secondary" = "primary"): BaseWidget {
    const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors"
    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    }

    return new WidgetBuilder("button")
      .addProp("text", text)
      .addProp("variant", variant)
      .addClass(`${baseClasses} ${variantClasses[variant]}`)
      .build()
  }

  static createForm(fields: Array<{ name: string; label: string; type: string; required?: boolean }>): BaseWidget {
    const formBuilder = new WidgetBuilder("form").addClass("space-y-4")

    fields.forEach((field) => {
      const fieldContainer = new WidgetBuilder("div")
        .addClass("form-field")
        .addChild(
          new WidgetBuilder("label")
            .addProp("content", field.label + (field.required ? " *" : ""))
            .addProp("htmlFor", field.name)
            .addClass("block text-sm font-medium text-gray-700 mb-1")
            .build(),
        )
        .addChild(
          new WidgetBuilder("input")
            .addProp("type", field.type)
            .addProp("name", field.name)
            .addProp("id", field.name)
            .addProp("required", field.required || false)
            .addClass(
              "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
            )
            .build(),
        )
        .build()

      formBuilder.addChild(fieldContainer)
    })

    return formBuilder.build()
  }

  static createHeroSection(title: string, subtitle: string, ctaText?: string): BaseWidget {
    const heroBuilder = new WidgetBuilder("section")
      .addClass("hero bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20")
      .addChild(
        new WidgetBuilder("div")
          .addClass("container mx-auto px-4 text-center")
          .addChild(
            new WidgetBuilder("h1").addProp("content", title).addClass("text-4xl md:text-6xl font-bold mb-6").build(),
          )
          .addChild(
            new WidgetBuilder("p").addProp("content", subtitle).addClass("text-xl md:text-2xl mb-8 opacity-90").build(),
          )
          .build(),
      )

    if (ctaText) {
      const container = heroBuilder.buildUnsafe().children![0]
      const ctaButton = CompositionBuilder.createButton(ctaText, "primary")
      ctaButton.props.className = "bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
      container.children!.push(ctaButton)
    }

    return heroBuilder.build()
  }

  static createNavigation(items: Array<{ text: string; href: string; active?: boolean }>): BaseWidget {
    const navBuilder = new WidgetBuilder("nav").addClass("bg-white shadow-sm border-b")

    const container = new WidgetBuilder("div")
      .addClass("container mx-auto px-4")
      .addChild(
        new WidgetBuilder("div")
          .addClass("flex items-center justify-between h-16")
          .addChild(
            new WidgetBuilder("div")
              .addClass("flex items-center space-x-8")
              .addChildren(
                items.map((item) =>
                  new WidgetBuilder("a")
                    .addProp("href", item.href)
                    .addProp("text", item.text)
                    .addClass(
                      item.active ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-600 transition-colors",
                    )
                    .build(),
                ),
              )
              .build(),
          )
          .build(),
      )
      .build()

    return navBuilder.addChild(container).build()
  }
}

// Default composition patterns
export const defaultCompositionPatterns: CompositionPattern[] = [
  {
    name: "simple-card",
    description: "A simple card with title and content",
    create: () => CompositionBuilder.createCard("Card Title", "Card content goes here"),
  },
  {
    name: "contact-form",
    description: "A basic contact form",
    create: () =>
      CompositionBuilder.createForm([
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "message", label: "Message", type: "textarea", required: true },
      ]),
  },
  {
    name: "hero-section",
    description: "A hero section with title, subtitle, and CTA",
    create: () =>
      CompositionBuilder.createHeroSection(
        "Welcome to Our Platform",
        "Build amazing experiences with our widget system",
        "Get Started",
      ),
  },
  {
    name: "main-navigation",
    description: "A main navigation bar",
    create: () =>
      CompositionBuilder.createNavigation([
        { text: "Home", href: "/", active: true },
        { text: "About", href: "/about" },
        { text: "Services", href: "/services" },
        { text: "Contact", href: "/contact" },
      ]),
  },
]
