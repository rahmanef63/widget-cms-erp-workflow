// Re-export from shared hooks for backward compatibility
export * from "@/shared/hooks"

// Legacy hook names for backward compatibility
import { useToast as sharedUseToast } from "@/shared/hooks"
export { sharedUseToast as useToast }
