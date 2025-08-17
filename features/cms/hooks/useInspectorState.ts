"use client"

import { useState, useMemo } from "react"

export function useInspectorState(selected?: any) {
  const [tab, setTab] = useState<"props" | "children">("props")
  const [unsplashOpen, setUnsplashOpen] = useState(false)
  const [unsplashQuery, setUnsplashQuery] = useState("")
  const [unsplashKey, setUnsplashKey] = useState("")
  const [unsplashResults, setUnsplashResults] = useState<any[]>([])

  const childrenIds = useMemo(() => [], [])
  const showChildrenTab = useMemo(() => false, [])
  const ctx = useMemo(() => undefined, [])

  const runUnsplash = async () => {
    try {
      if (!unsplashKey || !unsplashQuery) return
      const res = await fetch(
        `https://api.unsplash.com/search/photos?per_page=12&query=${encodeURIComponent(unsplashQuery)}`,
        { headers: { Authorization: `Client-ID ${unsplashKey}` } },
      )
      const json = await res.json()
      setUnsplashResults(json.results || [])
    } catch (e) {
      console.warn("Unsplash error", e)
    }
  }

  return {
    tab,
    setTab,
    unsplashOpen,
    setUnsplashOpen,
    unsplashQuery,
    setUnsplashQuery,
    unsplashKey,
    setUnsplashKey,
    unsplashResults,
    setUnsplashResults,
    runUnsplash,
    childrenIds,
    showChildrenTab,
    ctx,
  }
}
