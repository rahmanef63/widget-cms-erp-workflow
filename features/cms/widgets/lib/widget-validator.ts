import type { BaseWidget } from "../core/interfaces/base-widget"
import type { PropertyField, WidgetDefinition } from "../shared/types"

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationWarning {
  field: string
  message: string
  code: string
}

export class WidgetValidator {
  static validate(widget: BaseWidget, definition?: WidgetDefinition): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Basic widget validation
    if (!widget.id) {
      errors.push({
        field: "id",
        message: "Widget must have an ID",
        code: "MISSING_ID",
      })
    }

    if (!widget.type) {
      errors.push({
        field: "type",
        message: "Widget must have a type",
        code: "MISSING_TYPE",
      })
    }

    if (!widget.version) {
      warnings.push({
        field: "version",
        message: "Widget should have a version",
        code: "MISSING_VERSION",
      })
    }

    // Property validation based on definition
    if (definition && definition.propertySchema) {
      const propErrors = this.validateProperties(widget.props, definition.propertySchema)
      errors.push(...propErrors)
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }

  static validateProperties(props: Record<string, any>, schema: PropertyField[]): ValidationError[] {
    const errors: ValidationError[] = []

    schema.forEach((field) => {
      const value = props[field.key]

      // Required field validation
      if (field.required && (value === undefined || value === null || value === "")) {
        errors.push({
          field: field.key,
          message: `${field.label} is required`,
          code: "REQUIRED_FIELD",
        })
        return
      }

      // Skip validation if field is not present and not required
      if (value === undefined || value === null) {
        return
      }

      // Type-specific validation
      switch (field.type) {
        case "number":
          if (typeof value !== "number" || isNaN(value)) {
            errors.push({
              field: field.key,
              message: `${field.label} must be a valid number`,
              code: "INVALID_NUMBER",
            })
          } else {
            if (field.min !== undefined && value < field.min) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at least ${field.min}`,
                code: "MIN_VALUE",
              })
            }
            if (field.max !== undefined && value > field.max) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at most ${field.max}`,
                code: "MAX_VALUE",
              })
            }
          }
          break

        case "text":
        case "textarea":
          if (typeof value !== "string") {
            errors.push({
              field: field.key,
              message: `${field.label} must be a string`,
              code: "INVALID_STRING",
            })
          } else {
            if (field.validation?.minLength && value.length < field.validation.minLength) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at least ${field.validation.minLength} characters`,
                code: "MIN_LENGTH",
              })
            }
            if (field.validation?.maxLength && value.length > field.validation.maxLength) {
              errors.push({
                field: field.key,
                message: `${field.label} must be at most ${field.validation.maxLength} characters`,
                code: "MAX_LENGTH",
              })
            }
            if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
              errors.push({
                field: field.key,
                message: `${field.label} format is invalid`,
                code: "INVALID_PATTERN",
              })
            }
          }
          break

        case "select":
          if (field.options && !field.options.includes(value)) {
            errors.push({
              field: field.key,
              message: `${field.label} must be one of: ${field.options.join(", ")}`,
              code: "INVALID_OPTION",
            })
          }
          break

        case "toggle":
          if (typeof value !== "boolean") {
            errors.push({
              field: field.key,
              message: `${field.label} must be a boolean`,
              code: "INVALID_BOOLEAN",
            })
          }
          break

        case "color":
          if (typeof value !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(value)) {
            errors.push({
              field: field.key,
              message: `${field.label} must be a valid hex color`,
              code: "INVALID_COLOR",
            })
          }
          break

        case "url":
          if (typeof value !== "string") {
            errors.push({
              field: field.key,
              message: `${field.label} must be a string`,
              code: "INVALID_STRING",
            })
          } else {
            try {
              new URL(value)
            } catch {
              errors.push({
                field: field.key,
                message: `${field.label} must be a valid URL`,
                code: "INVALID_URL",
              })
            }
          }
          break

        case "email":
          if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push({
              field: field.key,
              message: `${field.label} must be a valid email address`,
              code: "INVALID_EMAIL",
            })
          }
          break
      }

      // Custom validation
      if (field.validation?.custom) {
        const customResult = field.validation.custom(value)
        if (customResult !== true) {
          errors.push({
            field: field.key,
            message: typeof customResult === "string" ? customResult : `${field.label} is invalid`,
            code: "CUSTOM_VALIDATION",
          })
        }
      }
    })

    return errors
  }

  static validateComposition(composition: any): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    if (!composition.type) {
      errors.push({
        field: "type",
        message: "Composition must have a type",
        code: "MISSING_TYPE",
      })
    }

    if (!composition.props) {
      warnings.push({
        field: "props",
        message: "Composition should have props",
        code: "MISSING_PROPS",
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    }
  }
}
