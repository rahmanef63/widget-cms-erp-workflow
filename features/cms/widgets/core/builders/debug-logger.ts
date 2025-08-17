export class DebugLogger {
  private static instance: DebugLogger
  private logs: Array<{ timestamp: Date; level: string; message: string; data?: any }> = []

  static getInstance(): DebugLogger {
    if (!DebugLogger.instance) {
      DebugLogger.instance = new DebugLogger()
    }
    return DebugLogger.instance
  }

  log(level: "info" | "warn" | "error", message: string, data?: any): void {
    const logEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
    }
    this.logs.push(logEntry)
    console.log(`[${level.toUpperCase()}] ${message}`, data || "")
  }

  info(message: string, data?: any): void {
    this.log("info", message, data)
  }

  warn(message: string, data?: any): void {
    this.log("warn", message, data)
  }

  error(message: string, data?: any): void {
    this.log("error", message, data)
  }

  getLogs(): Array<{ timestamp: Date; level: string; message: string; data?: any }> {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }
}

// Module import tracker
export function trackImport(moduleName: string, fromFile: string): void {
  const logger = DebugLogger.getInstance()
  logger.info(`Importing ${moduleName} from ${fromFile}`)
}

// Error boundary for widget operations
export function withErrorHandling<T>(operation: () => T, context: string): T | null {
  const logger = DebugLogger.getInstance()
  try {
    logger.info(`Starting operation: ${context}`)
    const result = operation()
    logger.info(`Completed operation: ${context}`)
    return result
  } catch (error) {
    logger.error(`Error in ${context}:`, error)
    console.error(`Widget Builder Error in ${context}:`, error)
    return null
  }
}
