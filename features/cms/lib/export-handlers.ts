"use client"

import { useToast } from "@/shared/hooks/use-toast"
import {generateComponentCode , generateStandaloneHTML, download} from "@/features/cms/widgets/core/exporters"

export class ExportHandlers {
  constructor(private cmsState: any) {}

  exportSingleFile = () => {
    const ctx = (window as any).__CMS_BUILDER__ as any
    if (!ctx) return alert("Context missing.")
    const roots = this.cmsState.edges
      .filter((e: any) => ctx.nodesMap.get(e.target)?.data.type === "preview")
      .map((e: any) => e.source)
    if (!roots.length) return alert("Connect a root to the Preview first.")
    const code = generateComponentCode("GeneratedPage", roots[0], this.cmsState.nodes as any, this.cmsState.edges)
    download("GeneratedPage.tsx", code)
  }

  exportEachRootAsFile = () => {
    const ctx = (window as any).__CMS_BUILDER__ as any
    if (!ctx) return
    const roots = Array.from(
      new Set(
        this.cmsState.edges
          .filter((e: any) => ctx.nodesMap.get(e.target)?.data.type === "preview")
          .map((e: any) => e.source),
      ),
    )
    if (!roots.length) return alert("No roots connected to Preview.");
    (roots as string[]).forEach((r: string, idx: number) => {
      const code = generateComponentCode(`Generated_${idx + 1}`, r, this.cmsState.nodes as any, this.cmsState.edges)
      download(`Generated_${idx + 1}.tsx`, code)
    })
  }

  exportStandaloneHTML = () => {
    const ctx = (window as any).__CMS_BUILDER__ as any
    if (!ctx) return
    const roots = Array.from(
      new Set(
        this.cmsState.edges
          .filter((e: any) => ctx.nodesMap.get(e.target)?.data.type === "preview")
          .map((e: any) => e.source),
      ),
    )
    if (!roots.length) return alert("No roots connected to Preview.");
    (roots as string[]).forEach((r: string, idx: number) => {
      const html = generateStandaloneHTML(`Generated_${idx + 1}`, r, this.cmsState.nodes as any, this.cmsState.edges)
      download(`Generated_${idx + 1}.html`, html)
    })
  }

  exportSchema = () => {
    const { toast } = useToast()
    const schema = this.cmsState.exportSchema()
    navigator.clipboard?.writeText(JSON.stringify(schema, null, 2))
    toast({ title: "Copied", description: "Schema copied to clipboard." })
  }

  shareLink = () => {
    const { toast } = useToast()
    try {
      console.log("🔄 [CHAT] Generating share link")
      const schema = {
        nodes: this.cmsState.nodes.map(({ id, type, data, position }: any) => ({ id, rfType: type, data, position })),
        edges: this.cmsState.edges,
      }
      const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(schema))))
      const url = `${location.origin}/render?schema=${b64}`
      navigator.clipboard?.writeText(url)
      toast({ title: "Share link copied", description: "Open /render to view the page." })
    } catch (error) {
      console.error("❌ [CHAT] Error generating share link:", error)
      toast({
        title: "Share Error",
        description: "Failed to generate share link",
        variant: "destructive",
      })
    }
  }
}
