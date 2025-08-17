import { WidgetMigrator } from "../core/migration/widget-migrator"
import { WidgetVersionRegistry } from "../core/migration/version-registry"
import type { BaseWidget } from "../core/interfaces/base-widget"

export class MigrationScripts {
  private static migrator = WidgetMigrator.getInstance()
  private static registry = WidgetVersionRegistry.getInstance()

  // Migrate all widgets in a schema to latest versions
  static async migrateSchema(schema: BaseWidget[]): Promise<{
    success: boolean
    migratedWidgets: BaseWidget[]
    errors: string[]
    summary: {
      total: number
      migrated: number
      failed: number
      skipped: number
    }
  }> {
    const results = await this.migrator.migrateMany(schema)
    const errors: string[] = []
    const migratedWidgets: BaseWidget[] = []
    let migrated = 0
    let failed = 0
    let skipped = 0

    for (const result of results) {
      if (result.success && result.widget) {
        migratedWidgets.push(result.widget)
        if (result.migrationsApplied.length > 0) {
          migrated++
        } else {
          skipped++
        }
      } else {
        failed++
        if (result.errors) {
          errors.push(...result.errors)
        }
      }
    }

    return {
      success: failed === 0,
      migratedWidgets,
      errors,
      summary: {
        total: schema.length,
        migrated,
        failed,
        skipped,
      },
    }
  }

  // Check for deprecated widgets in schema
  static checkDeprecatedWidgets(schema: BaseWidget[]): {
    deprecatedWidgets: Array<{
      widget: BaseWidget
      deprecationInfo: {
        deprecated: boolean
        date?: Date
        reason?: string
      }
    }>
    hasDeprecated: boolean
  } {
    const deprecatedWidgets: Array<{
      widget: BaseWidget
      deprecationInfo: {
        deprecated: boolean
        date?: Date
        reason?: string
      }
    }> = []

    for (const widget of schema) {
      const deprecationInfo = this.migrator.getDeprecationInfo(widget.type, widget.version || "1.0.0")
      if (deprecationInfo.deprecated) {
        deprecatedWidgets.push({
          widget,
          deprecationInfo,
        })
      }
    }

    return {
      deprecatedWidgets,
      hasDeprecated: deprecatedWidgets.length > 0,
    }
  }

  // Generate migration report
  static generateMigrationReport(schema: BaseWidget[]): {
    widgets: Array<{
      id: string
      type: string
      currentVersion: string
      latestVersion: string
      needsMigration: boolean
      canMigrate: boolean
      deprecated: boolean
    }>
    summary: {
      total: number
      needsMigration: number
      canMigrate: number
      deprecated: number
    }
  } {
    const widgets = schema.map((widget) => {
      const currentVersion = widget.version || "1.0.0"
      const latestVersion = this.registry.getLatestVersion(widget.type)?.version || currentVersion
      const needsMigration = currentVersion !== latestVersion
      const canMigrate = needsMigration ? this.migrator.canMigrate(widget.type, currentVersion, latestVersion) : false
      const deprecated = this.migrator.isVersionDeprecated(widget.type, currentVersion)

      return {
        id: widget.id,
        type: widget.type,
        currentVersion,
        latestVersion,
        needsMigration,
        canMigrate,
        deprecated,
      }
    })

    const summary = {
      total: widgets.length,
      needsMigration: widgets.filter((w) => w.needsMigration).length,
      canMigrate: widgets.filter((w) => w.canMigrate).length,
      deprecated: widgets.filter((w) => w.deprecated).length,
    }

    return { widgets, summary }
  }

  // Backup schema before migration
  static createBackup(schema: BaseWidget[]): {
    backup: BaseWidget[]
    timestamp: Date
    checksum: string
  } {
    const backup = JSON.parse(JSON.stringify(schema))
    const timestamp = new Date()
    const checksum = this.generateChecksum(JSON.stringify(schema))

    return { backup, timestamp, checksum }
  }

  // Restore schema from backup
  static restoreFromBackup(backup: {
    backup: BaseWidget[]
    timestamp: Date
    checksum: string
  }): BaseWidget[] {
    // Verify checksum
    const currentChecksum = this.generateChecksum(JSON.stringify(backup.backup))
    if (currentChecksum !== backup.checksum) {
      throw new Error("Backup integrity check failed")
    }

    return JSON.parse(JSON.stringify(backup.backup))
  }

  private static generateChecksum(data: string): string {
    // Simple checksum implementation
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16)
  }
}
