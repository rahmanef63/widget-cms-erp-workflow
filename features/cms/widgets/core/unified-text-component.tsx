import type { TextNode } from "./unified-widget-system"
import { useRenderProfile } from "./render-context"
import { SemanticText } from "./semantic-adapter"
import { ShadcnText } from "./shadcn-adapter"

export function UnifiedText({ node }: { node: TextNode }) {
  const profile = useRenderProfile()

  try {
    return profile === "semantic" ? <SemanticText node={node} /> : <ShadcnText node={node} />
  } catch (error) {
    console.error(`[v0] Error rendering widget ${node.id}:`, error)
    return <div className="text-red-500 p-2 border border-red-300 rounded">Widget Error: {node.id}</div>
  }
}
