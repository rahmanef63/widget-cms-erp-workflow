import type { z } from "zod"
import type { BaseWidget } from "../interfaces/base-widget"

export interface Migration {
  fromVersion: string
  toVersion: string
  description: string
  migrate: (widget: BaseWidget) => BaseWidget | Promise<BaseWidget>
  rollback?: (widget: BaseWidget) => BaseWidget | Promise<BaseWidget>
  validate?: (widget: BaseWidget) => boolean
}

export interface WidgetVersion {
  version: string
  schema: z.ZodSchema
  migrations: Migration[]
  deprecated?: boolean
  deprecationDate?: Date
  deprecationReason?: string
  releaseDate: Date
  changelog?: string[]
}

export class WidgetVersionRegistry {
  private static instance: WidgetVersionRegistry
  private readonly versions = new Map<string, Map<string, WidgetVersion>>()

  private constructor() {
    this.registerDefaultVersions()
  }

  static getInstance(): WidgetVersionRegistry {
    if (!WidgetVersionRegistry.instance) {
      WidgetVersionRegistry.instance = new WidgetVersionRegistry()
    }
    return WidgetVersionRegistry.instance
  }

  register(widgetType: string, version: WidgetVersion): void {
    if (!this.versions.has(widgetType)) {
      this.versions.set(widgetType, new Map())
    }
    this.versions.get(widgetType)!.set(version.version, version)
  }

  getVersion(widgetType: string, version: string): WidgetVersion | null {
    return this.versions.get(widgetType)?.get(version) || null
  }

  getLatestVersion(widgetType: string): WidgetVersion | null {
    const typeVersions = this.versions.get(widgetType)
    if (!typeVersions) return null

    const versions = Array.from(typeVersions.values())
    const nonDeprecated = versions.filter((v) => !v.deprecated)
    const sortedVersions = (nonDeprecated.length > 0 ? nonDeprecated : versions).sort((a, b) =>
      this.compareVersions(b.version, a.version),
    )

    return sortedVersions[0] || null
  }

  getVersions(widgetType: string): string[] {
    const typeVersions = this.versions.get(widgetType)
    if (!typeVersions) return []

    return Array.from(typeVersions.keys()).sort(this.compareVersions)
  }

  getMigrationPath(widgetType: string, fromVersion: string, toVersion: string): Migration[] {
    const typeVersions = this.versions.get(widgetType)
    if (!typeVersions) return []

    // Simple path finding - assumes linear migration path
    const versions = this.getVersions(widgetType)
    const fromIndex = versions.indexOf(fromVersion)
    const toIndex = versions.indexOf(toVersion)

    if (fromIndex === -1 || toIndex === -1) return []
    if (fromIndex === toIndex) return []

    const migrations: Migration[] = []
    const direction = fromIndex < toIndex ? 1 : -1
    const start = fromIndex
    const end = toIndex

    for (let i = start; i !== end; i += direction) {
      const currentVersion = versions[i]
      const nextVersion = versions[i + direction]
      const versionInfo = typeVersions.get(currentVersion)

      if (versionInfo) {
        const migration = versionInfo.migrations.find((m) =>
          direction > 0 ? m.toVersion === nextVersion : m.fromVersion === nextVersion,
        )
        if (migration) {
          migrations.push(migration)
        }
      }
    }

    return migrations
  }

  private compareVersions(a: string, b: string): number {
    const aParts = a.split(".").map(Number)
    const bParts = b.split(".").map(Number)

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0
      const bPart = bParts[i] || 0

      if (aPart > bPart) return 1
      if (aPart < bPart) return -1
    }

    return 0
  }

  private registerDefaultVersions(): void {
    // Button widget versions
    this.register("button", {
      version: "1.0.0",
      schema: {} as z.ZodSchema, // Will be set by schema registry
      migrations: [],
      releaseDate: new Date("2024-01-01"),
      changelog: ["Initial button widget implementation"],
    })

    this.register("button", {
      version: "1.1.0",
      schema: {} as z.ZodSchema,
      migrations: [
        {
          fromVersion: "1.0.0",
          toVersion: "1.1.0",
          description: "Add loading state support",
          migrate: (widget) => ({
            ...widget,
            props: {
              ...widget.props,
              loading: false,
            },
            version: "1.1.0",
          }),
          rollback: (widget) => {
            const { loading, ...props } = widget.props
            return {
              ...widget,
              props,
              version: "1.0.0",
            }
          },
        },
      ],
      releaseDate: new Date("2024-02-01"),
      changelog: ["Added loading state", "Improved accessibility"],
    })

    this.register("button", {
      version: "2.0.0",
      schema: {} as z.ZodSchema,
      migrations: [
        {
          fromVersion: "1.1.0",
          toVersion: "2.0.0",
          description: "Rename 'type' prop to 'variant'",
          migrate: (widget) => ({
            ...widget,
            props: {
              ...widget.props,
              variant: widget.props.type || "primary",
              type: undefined,
            },
            version: "2.0.0",
          }),
          rollback: (widget) => ({
            ...widget,
            props: {
              ...widget.props,
              type: widget.props.variant || "primary",
              variant: undefined,
            },
            version: "1.1.0",
          }),
        },
      ],
      releaseDate: new Date("2024-03-01"),
      changelog: ["BREAKING: Renamed 'type' prop to 'variant'", "Added ghost variant", "Improved theming support"],
    })

    // Input widget versions
    this.register("input", {
      version: "1.0.0",
      schema: {} as z.ZodSchema,
      migrations: [],
      releaseDate: new Date("2024-01-01"),
      changelog: ["Initial input widget implementation"],
    })

    this.register("input", {
      version: "1.1.0",
      schema: {} as z.ZodSchema,
      migrations: [
        {
          fromVersion: "1.0.0",
          toVersion: "1.1.0",
          description: "Add validation props",
          migrate: (widget) => ({
            ...widget,
            props: {
              ...widget.props,
              minLength: undefined,
              maxLength: undefined,
              pattern: undefined,
            },
            version: "1.1.0",
          }),
          rollback: (widget) => {
            const { minLength, maxLength, pattern, ...props } = widget.props
            return {
              ...widget,
              props,
              version: "1.0.0",
            }
          },
        },
      ],
      releaseDate: new Date("2024-02-15"),
      changelog: ["Added validation props", "Improved error handling"],
    })
  }
}
