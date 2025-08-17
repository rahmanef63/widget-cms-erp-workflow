import { CANVAS_SELECTORS, GLOBAL_KEYS, LOG_PREFIXES } from "../components/toolbar/constants"
import type { CanvasValidation } from "../types/toolbar-types"

export function validateCanvas(): CanvasValidation {
  const validation: CanvasValidation = {
    isValid: false,
    hasReactFlow: false,
    hasViewport: false,
    nodeCount: 0,
    edgeCount: 0,
    errors: [],
    warnings: [],
  }

  try {
    // Check for ReactFlow wrapper
    const wrapper = document.querySelector(CANVAS_SELECTORS.REACT_FLOW_WRAPPER)
    if (!wrapper) {
      validation.errors.push("ReactFlow wrapper not found")
    } else {
      validation.hasReactFlow = true
    }

    // Check for viewport
    const viewport = document.querySelector(CANVAS_SELECTORS.REACT_FLOW_VIEWPORT)
    if (!viewport) {
      validation.errors.push("ReactFlow viewport not found")
    } else {
      validation.hasViewport = true
    }

    // Check for global ReactFlow instance
    const instance = (window as any)[GLOBAL_KEYS.REACT_FLOW_INSTANCE]
    if (!instance) {
      validation.warnings.push("ReactFlow instance not exposed globally")
    }

    // Count nodes and edges
    const nodes = document.querySelectorAll(".react-flow__node")
    const edges = document.querySelectorAll(".react-flow__edge")
    validation.nodeCount = nodes.length
    validation.edgeCount = edges.length

    // Determine if valid
    validation.isValid = validation.hasReactFlow && validation.hasViewport && validation.errors.length === 0

    return validation
  } catch (error) {
    validation.errors.push(`Validation error: ${error}`)
    return validation
  }
}

export function logCanvasState(): void {
  const validation = validateCanvas()

  console.log(`${LOG_PREFIXES.CANVAS} Canvas Validation:`, {
    isValid: validation.isValid,
    hasReactFlow: validation.hasReactFlow,
    hasViewport: validation.hasViewport,
    nodeCount: validation.nodeCount,
    edgeCount: validation.edgeCount,
    errors: validation.errors,
    warnings: validation.warnings,
    timestamp: new Date().toISOString(),
  })

  if (validation.errors.length > 0) {
    console.error(`${LOG_PREFIXES.ERROR} Canvas validation errors:`, validation.errors)
  }

  if (validation.warnings.length > 0) {
    console.warn(`${LOG_PREFIXES.WARNING} Canvas validation warnings:`, validation.warnings)
  }
}

export function getReactFlowInstance() {
  const instance = (window as any)[GLOBAL_KEYS.REACT_FLOW_INSTANCE]
  if (!instance) {
    console.warn(`${LOG_PREFIXES.WARNING} ReactFlow instance not available`)
  }
  return instance
}

export function waitForReactFlowInstance(timeout = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const checkInstance = () => {
      const instance = getReactFlowInstance()
      if (instance) {
        console.log(`${LOG_PREFIXES.SUCCESS} ReactFlow instance found after ${Date.now() - startTime}ms`)
        resolve(instance)
        return
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error(`ReactFlow instance not found within ${timeout}ms`))
        return
      }

      setTimeout(checkInstance, 100)
    }

    checkInstance()
  })
}
