export interface ErrorInfo {
  message: string
  code?: string
  stack?: string
  context?: Record<string, any>
  timestamp: Date
}

export class ErrorHandler {
  private static errors: ErrorInfo[] = []
  private static maxErrors = 100

  static capture(error: Error | string, context?: Record<string, any>): ErrorInfo {
    const errorInfo: ErrorInfo = {
      message: typeof error === "string" ? error : error.message,
      code: typeof error === "object" && "code" in error ? error.code : undefined,
      stack: typeof error === "object" ? error.stack : undefined,
      context,
      timestamp: new Date(),
    }

    this.errors.unshift(errorInfo)
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors)
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error captured:", errorInfo)
    }

    return errorInfo
  }

  static getErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  static clearErrors(): void {
    this.errors = []
  }

  static getErrorsByCode(code: string): ErrorInfo[] {
    return this.errors.filter((error) => error.code === code)
  }

  static getRecentErrors(minutes = 5): ErrorInfo[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000)
    return this.errors.filter((error) => error.timestamp > cutoff)
  }
}

// Global error boundary helper
export function withErrorBoundary<T extends (...args: any[]) => any>(fn: T, context?: Record<string, any>): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args)

      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          ErrorHandler.capture(error, context)
          throw error
        })
      }

      return result
    } catch (error) {
      ErrorHandler.capture(error, context)
      throw error
    }
  }) as T
}

// Utility for safe async operations
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: Record<string, any>,
): Promise<T | undefined> {
  try {
    return await operation()
  } catch (error) {
    ErrorHandler.capture(error, context)
    return fallback
  }
}

// Utility for safe sync operations
export function safeSync<T>(operation: () => T, fallback?: T, context?: Record<string, any>): T | undefined {
  try {
    return operation()
  } catch (error) {
    ErrorHandler.capture(error, context)
    return fallback
  }
}
