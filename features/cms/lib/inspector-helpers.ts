import type { Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"

export function getChildrenIds(
  selected: Node<CompNodeData> | undefined,
  ctx: { nodesMap: Map<string, Node<CompNodeData>>; childrenOf: Map<string, string[]> } | undefined,
): string[] {
  if (!ctx || !selected) return []

  const ids = (ctx.childrenOf.get(selected.id) || []).slice()
  const order = (selected.data.props as any)?.childOrder as string[] | undefined

  if (order && Array.isArray(order) && order.length) {
    const ordered = order.filter((id) => ids.includes(id))
    const rest = ids.filter((id) => !ordered.includes(id))
    return [...ordered, ...rest]
  }

  // fallback to x-order
  ids.sort((a, b) => {
    const na = ctx.nodesMap.get(a)
    const nb = ctx.nodesMap.get(b)
    return (na?.position.x || 0) - (nb?.position.x || 0)
  })
  return ids
}

export function shouldShowChildrenTab(type: string): boolean {
  return ["row", "column", "section", "card", "alert"].includes(type)
}

export function createPropertySetter<T extends CompNodeData>(onChange: (updater: (d: T) => T) => void) {
  return (key: string, value: any) => {
    onChange((d) => ({ ...d, props: { ...d.props, [key]: value } }))
  }
}
