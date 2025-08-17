import type { ValidationError } from "../interfaces/base-widget"

export class WidgetValidationError extends Error {
  public readonly errors: ValidationError[]

  constructor(errors: ValidationError[]) {
    const message = `Widget validation failed:\n${errors.map((e) => `  ${e.path}: ${e.message}`).join("\n")}`
    super(message)
    this.name = "WidgetValidationError"
    this.errors = errors
  }

  getErrorsForPath(path: string): ValidationError[] {
    return this.errors.filter((error) => error.path.startsWith(path))
  }

  hasErrorsForPath(path: string): boolean {
    return this.getErrorsForPath(path).length > 0
  }

  getFirstError(): ValidationError | null {
    return this.errors[0] || null
  }

  getErrorCount(): number {
    return this.errors.length
  }
}

export class SchemaNotFoundError extends Error {
  constructor(widgetType: string) {
    super(`No validation schema found for widget type: ${widgetType}`)
    this.name = "SchemaNotFoundError"
  }
}

export class InvalidWidgetTypeError extends Error {
  constructor(type: unknown) {
    super(`Invalid widget type: ${type}. Expected a non-empty string.`)
    this.name = "InvalidWidgetTypeError"
  }
}

export class ValidationUtils {
  static formatValidationErrors(errors: ValidationError[]): string {
    return errors.map((error) => `${error.path}: ${error.message}`).join(", ")
  }

  static groupErrorsByPath(errors: ValidationError[]): Record<string, ValidationError[]> {
    return errors.reduce(
      (groups, error) => {
        const rootPath = error.path.split(".")[0]
        if (!groups[rootPath]) {
          groups[rootPath] = []
        }
        groups[rootPath].push(error)
        return groups
      },
      {} as Record<string, ValidationError[]>,
    )
  }

  static hasRequiredFieldErrors(errors: ValidationError[]): boolean {
    return errors.some((error) => error.code === "invalid_type" || error.message.includes("required"))
  }

  static getFieldErrors(errors: ValidationError[], fieldPath: string): ValidationError[] {
    return errors.filter((error) => error.path === fieldPath || error.path.startsWith(`${fieldPath}.`))
  }
}
