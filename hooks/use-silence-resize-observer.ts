"use client"

import { useEffect } from "react"

export function useSilenceResizeObserver() {
  useEffect(() => {
    const matchRO = (s: string) =>
      typeof s === "string" &&
      (s.includes("ResizeObserver loop") ||
        s.includes("ResizeObserver") ||
        s.includes("ResizeObserver loop limit exceeded") ||
        s.includes("ResizeObserver loop completed with undelivered notifications"))

    const onErrorCapture = (e: Event) => {
      try {
        const err = e as ErrorEvent
        const msg = (err?.message || "").toString()
        if (matchRO(msg)) {
          err.preventDefault?.()
          // @ts-ignore
          e.stopImmediatePropagation?.()
          return false
        }
      } catch {}
      return undefined
    }

    const onRejection = (e: PromiseRejectionEvent) => {
      try {
        const reason =
          (typeof e?.reason === "string"
            ? e.reason
            : (e?.reason?.message as string | undefined) || String(e?.reason || "")) || ""
        if (matchRO(reason)) {
          e.preventDefault()
        }
      } catch {}
    }

    const originalError = console.error
    const originalWarn = console.warn
    const patchedError = (...args: any[]) => {
      try {
        const first = args[0]
        if (typeof first === "string" && matchRO(first)) {
          return
        }
        if (first && typeof first?.message === "string" && matchRO(first.message)) {
          return
        }
      } catch {}
      originalError(...args)
    }
    const patchedWarn = (...args: any[]) => {
      try {
        const first = args[0]
        if (typeof first === "string" && matchRO(first)) {
          return
        }
      } catch {}
      originalWarn(...args)
    }

    // Capture at multiple levels to stop early
    window.addEventListener("error", onErrorCapture as any, true)
    document.addEventListener("error", onErrorCapture as any, true)
    window.addEventListener("unhandledrejection", onRejection)

    // window.onerror fallback
    const prevOnError = window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
      if (matchRO(String(message || "")) || (error && matchRO(String((error as any)?.message || "")))) {
        return true // suppress
      }
      return prevOnError ? prevOnError(message, source, lineno, colno, error) : false
    }

    // Silence console noise (dev only)
    ;(console as any).error = patchedError
    ;(console as any).warn = patchedWarn

    return () => {
      window.removeEventListener("error", onErrorCapture as any, true)
      document.removeEventListener("error", onErrorCapture as any, true)
      window.removeEventListener("unhandledrejection", onRejection)
      console.error = originalError
      console.warn = originalWarn
      window.onerror = prevOnError || null
    }
  }, [])
}

export default useSilenceResizeObserver
