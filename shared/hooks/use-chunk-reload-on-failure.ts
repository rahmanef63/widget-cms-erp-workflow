"use client"

import { useEffect } from "react"

// Reload the page once if a dynamic chunk fails to load.
// Avoid infinite loops using sessionStorage guard.
export function useChunkReloadOnFailure() {
  useEffect(() => {
    const KEY = "__reloaded_after_chunk_error__"

    const isChunkError = (msg: string) =>
      typeof msg === "string" &&
      (msg.includes("Loading chunk") ||
        msg.includes("ChunkLoadError") ||
        msg.includes("failed") ||
        /.*static\/chunks\/\d+.*\.js/.test(msg))

    const onceReload = () => {
      try {
        if (sessionStorage.getItem(KEY) === "1") return
        sessionStorage.setItem(KEY, "1")
      } catch {}
      // Force a hard reload to get the new chunk map
      location.reload()
    }

    const onUnhandledRejection = (e: PromiseRejectionEvent) => {
      try {
        const reason =
          (typeof e?.reason === "string"
            ? e.reason
            : (e?.reason?.message as string | undefined) || String(e?.reason || "")) || ""
        if (isChunkError(reason)) {
          e.preventDefault()
          onceReload()
        }
      } catch {}
    }

    const onWindowError = (e: ErrorEvent) => {
      try {
        const msg = (e?.message || "").toString()
        if (isChunkError(msg)) {
          e.preventDefault?.()
          onceReload()
          return true
        }
      } catch {}
      return undefined
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection)
    window.addEventListener("error", onWindowError)

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection)
      window.removeEventListener("error", onWindowError)
    }
  }, [])
}
