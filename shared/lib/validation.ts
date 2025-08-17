export interface ValidationRule<T = any> {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: T) => boolean | string
  message?: string
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
  warnings: Record<string, string>
}

export class Validator {
  static validate<T extends Record<string, any>>(data: T, schema: ValidationSchema): ValidationResult {
    const errors: Record<string, string> = {}
    const warnings: Record<string, string> = {}

    Object.entries(schema).forEach(([field, rule]) => {
      const value = data[field]

      // Required validation
      if (rule.required && (value === undefined || value === null || value === "")) {
        errors[field] = rule.message || `${field} is required`
        return
      }

      // Skip other validations if field is empty and not required
      if (value === undefined || value === null || value === "") {
        return
      }

      // Min/Max validation for numbers
      if (typeof value === "number") {
        if (rule.min !== undefined && value < rule.min) {
          errors[field] = rule.message || `${field} must be at least ${rule.min}`
        }
        if (rule.max !== undefined && value > rule.max) {
          errors[field] = rule.message || `${field} must be at most ${rule.max}`
        }
      }

      // Min/Max validation for strings (length)
      if (typeof value === "string") {
        if (rule.min !== undefined && value.length < rule.min) {
          errors[field] = rule.message || `${field} must be at least ${rule.min} characters`
        }
        if (rule.max !== undefined && value.length > rule.max) {
          errors[field] = rule.message || `${field} must be at most ${rule.max} characters`
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
        errors[field] = rule.message || `${field} format is invalid`
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value)
        if (result !== true) {
          errors[field] = typeof result === "string" ? result : rule.message || `${field} is invalid`
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validateUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static validateHexColor(color: string): boolean {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/
    return hexRegex.test(color)
  }

  static sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production, use a proper library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
  }
}
