export * from "./widget-migrator"
export * from "./version-registry"
export * from "./migration-runner"

// Re-export commonly used classes and types
export { WidgetMigrator } from "./widget-migrator"
export { WidgetVersionRegistry } from "./version-registry"
export { MigrationRunner } from "./migration-runner"
export type { Migration, WidgetVersion } from "./version-registry"
export type { MigrationResult } from "./widget-migrator"
