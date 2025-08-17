import type { BaseWidget } from "../interfaces/base-widget"
import type { Migration } from "./version-registry"

export interface MigrationRunResult {
  success: boolean
  widget?: BaseWidget
  migrationsApplied: string[]
  errors?: string[]
  warnings?: string[]
}

export class MigrationRunner {
  async runMigrations(widget: BaseWidget, migrations: Migration[]): Promise<MigrationRunResult> {
    let currentWidget = { ...widget }
    const migrationsApplied: string[] = []
    const errors: string[] = []
    const warnings: string[] = []

    for (const migration of migrations) {
      try {
        // Validate before migration if validator exists
        if (migration.validate && !migration.validate(currentWidget)) {
          warnings.push(`Widget validation failed before migration ${migration.fromVersion} -> ${migration.toVersion}`)
        }

        // Run migration
        const migratedWidget = await migration.migrate(currentWidget)

        // Update current widget
        currentWidget = migratedWidget
        migrationsApplied.push(`${migration.fromVersion} -> ${migration.toVersion}`)

        // Update metadata
        if (!currentWidget.metadata) {
          currentWidget.metadata = {
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        } else {
          currentWidget.metadata.updatedAt = new Date()
        }

        // Add migration history to metadata
        if (!currentWidget.metadata.migrationHistory) {
          currentWidget.metadata.migrationHistory = []
        }
        currentWidget.metadata.migrationHistory.push({
          fromVersion: migration.fromVersion,
          toVersion: migration.toVersion,
          migratedAt: new Date(),
          description: migration.description,
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown migration error"
        errors.push(`Migration ${migration.fromVersion} -> ${migration.toVersion} failed: ${errorMessage}`)

        // Stop on first error
        break
      }
    }

    return {
      success: errors.length === 0,
      widget: currentWidget,
      migrationsApplied,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }

  async runSingleMigration(widget: BaseWidget, migration: Migration): Promise<MigrationRunResult> {
    return this.runMigrations(widget, [migration])
  }

  validateMigrationChain(migrations: Migration[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    for (let i = 0; i < migrations.length - 1; i++) {
      const current = migrations[i]
      const next = migrations[i + 1]

      if (current.toVersion !== next.fromVersion) {
        errors.push(`Migration chain broken: ${current.toVersion} -> ${next.fromVersion}`)
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  async dryRun(widget: BaseWidget, migrations: Migration[]): Promise<MigrationRunResult> {
    // Clone widget to avoid mutations
    const clonedWidget = JSON.parse(JSON.stringify(widget))
    return this.runMigrations(clonedWidget, migrations)
  }
}

// Extend BaseWidget metadata to include migration history
declare module "../interfaces/base-widget" {
  interface WidgetMetadata {
    migrationHistory?: Array<{
      fromVersion: string
      toVersion: string
      migratedAt: Date
      description: string
    }>
  }
}
