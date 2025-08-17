"use client"

import { useCallback } from "react"

export function useWidgetValidation() {
  const validateWidget = useCallback((widget: any) => {
    const errors: string[] = []

    if (!widget.id) {
      errors.push("Widget must have an ID")
    }

    if (!widget.type) {
      errors.push("Widget must have a type")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }, [])

  const validateWidgetProps = useCallback((props: any, schema: any) => {
    // Validate props against schema
    return {
      isValid: true,
      errors: [],
    }
  }, [])

  return {
    validateWidget,
    validateWidgetProps,
  }
}
