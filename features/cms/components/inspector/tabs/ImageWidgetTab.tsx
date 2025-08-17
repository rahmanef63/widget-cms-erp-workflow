"use client"
import React from "react"
import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createPropertySetter } from "@/features/cms/lib/inspector-helpers"


interface ImageWidgetTabProps {
  selected: Node<CompNodeData>
  onChange: (updater: (d: CompNodeData) => CompNodeData) => void
}

export function ImageWidgetTab({ selected, onChange }: ImageWidgetTabProps) {
  const [unsplashOpen, setUnsplashOpen] = React.useState(false)
  const [unsplashQuery, setUnsplashQuery] = React.useState("")
  const [unsplashKey, setUnsplashKey] = React.useState("")
  const [unsplashResults, setUnsplashResults] = React.useState<any[]>([])

  const setProp = createPropertySetter(onChange)

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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setUnsplashOpen(true)}>
          Search Unsplash
        </Button>
      </div>
      {unsplashOpen && (
        <div className="rounded-xl border p-2 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Unsplash Access Key"
              className="flex-1"
              value={unsplashKey}
              onChange={(e) => setUnsplashKey(e.target.value)}
            />
            <Input
              placeholder="Search query (e.g., nature)"
              className="flex-1"
              value={unsplashQuery}
              onChange={(e) => setUnsplashQuery(e.target.value)}
            />
            <Button variant="outline" size="sm" onClick={runUnsplash}>
              Search
            </Button>
            <Button variant="outline" size="sm" onClick={() => setUnsplashOpen(false)}>
              Close
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-auto">
            {unsplashResults.map((r: any) => (
              <Button
                key={r.id}
                variant="outline"
                className="border rounded overflow-hidden p-0 h-auto bg-transparent"
                onClick={() => {
                  setProp("src", r.urls?.small || r.urls?.thumb || r.urls?.regular)
                  setUnsplashOpen(false)
                }}
              >
                <img
                  src={r.urls?.thumb || "/placeholder.svg?height=80&width=80&query=thumb"}
                  alt={r.alt_description || "img"}
                  className="w-full h-20 object-cover"
                />
              </Button>
            ))}
          </div>
          <div className="text-[10px] text-gray-500">Note: requires your own Unsplash API Access Key.</div>
        </div>
      )}
    </div>
  )
}
