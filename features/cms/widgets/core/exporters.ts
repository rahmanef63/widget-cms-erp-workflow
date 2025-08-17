import type { Edge, Node } from "reactflow"
import type { CompNodeData } from "@/shared/types/schema"
import { computeChildrenMap } from "./utils"

export function generateComponentCode(
  name: string,
  nodeId: string,
  nodes: Node<CompNodeData>[],
  edges: Edge[],
): string {
  const nodesMap = new Map(nodes.map((n) => [n.id, n] as const))
  const childrenOf = computeChildrenMap(edges)

  const emit = (id: string): string => {
    const n = nodesMap.get(id)
    if (!n) return ""
    const d = n.data as CompNodeData
    const props: any = d.props || {}
    const styleExpr = props.styleJson && props.styleJson !== "{}" ? ` style={${props.styleJson}}` : ""
    const clsExpr = props.className ? ` className="${props.className}"` : ""
    const childIds = (childrenOf[id] || []).filter((cid) => (nodesMap.get(cid)?.data.type as any) !== "preview")
    const childJsx = childIds.map(emit).join("\n")

    switch (d.type) {
      case "section":
        return `<section style={{ background: "${props.background}", padding: ${props.padding} }} className="w-full flex ${
          props.align === "center" ? "justify-center" : props.align === "right" ? "justify-end" : "justify-start"
        }">
  <div style={{ maxWidth: ${props.maxWidth} }}${clsExpr}${styleExpr}>
    ${childJsx}
  </div>
</section>`
      case "row":
        return `<div className="flex flex-row ${props.justify ? `justify-${props.justify}` : "justify-start"} ${
          props.align ? `items-${props.align}` : "items-start"
        } ${props.className || ""}" style={{ gap: ${props.gap}, padding: ${props.padding} }}${styleExpr}>
  ${childJsx}
</div>`
      case "column":
        return `<div className="flex flex-col ${props.justify ? `justify-${props.justify}` : "justify-start"} ${
          props.align ? `items-${props.align}` : "items-start"
        } ${props.className || ""}" style={{ gap: ${props.gap}, padding: ${props.padding} }}${styleExpr}>
  ${childJsx}
</div>`
      case "text":
        return `<${props.tag || "p"} style={{ fontSize: ${props.fontSize}, color: "${props.color}", fontWeight: ${props.weight}, textAlign: "${props.align}" }}${clsExpr}${styleExpr}>${props.content}</${
          props.tag || "p"
        }>`
      case "image":
        return `<img src="${props.src}" alt="${props.alt}" width={${props.width}} height={${props.height}} style={{ borderRadius: ${props.rounded} }}${clsExpr}${styleExpr} />`
      case "button":
        return `<a href="${props.href}" className="inline-block bg-black text-white ${
          props.size === "sm" ? "px-3 py-1.5" : props.size === "lg" ? "px-6 py-3" : "px-4 py-2"
        } ${props.className || ""}" style={{ borderRadius: ${props.rounded} }}${styleExpr}>${props.label}</a>`
      case "card":
        return `<div className="rounded-2xl border shadow-sm bg-white ${props.className || ""}" style={{ padding: ${props.padding} }}${styleExpr}>
  ${props.title ? `<div className="text-sm font-semibold mb-1">${props.title}</div>` : ""}
  ${props.description ? `<div className="text-xs text-gray-600">${props.description}</div>` : ""}
  <div className="mt-2">${childJsx}</div>
</div>`
      case "badge": {
        const classes =
          props.variant === "destructive"
            ? "bg-red-100 text-red-700"
            : props.variant === "secondary"
              ? "bg-gray-100 text-gray-700"
              : props.variant === "outline"
                ? "border text-gray-700"
                : "bg-black text-white"
        return `<span className="inline-block text-[10px] px-2 py-1 rounded ${classes} ${props.className || ""}"${styleExpr}>${props.text}</span>`
      }
      case "avatar":
        return `<img src="${props.src}" alt="${props.alt}" style={{ width: ${props.size}, height: ${props.size}, borderRadius: ${props.rounded} }}${clsExpr}${styleExpr} />`
      case "alert": {
        const palette =
          props.variant === "success"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : props.variant === "warning"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : props.variant === "destructive"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
        return `<div className="border rounded-xl p-3 ${palette} ${props.className || ""}"${styleExpr}>
  ${props.title ? `<div className="text-sm font-semibold">${props.title}</div>` : ""}
  ${props.description ? `<div className="text-xs opacity-80">${props.description}</div>` : ""}
  <div className="mt-2">${childJsx}</div>
</div>`
      }
      case "separator":
        return props.orientation === "vertical"
          ? `<div className="${props.className || ""}" style={{ width: ${props.thickness}, background: "${props.color}" }}${styleExpr} />`
          : `<div className="${props.className || ""}" style={{ height: ${props.thickness}, background: "${props.color}" }}${styleExpr} />`
      default:
        return ""
    }
  }

  const body = emit(nodeId)
  return `import React from "react";

export default function ${name}(){
  return (
    <>
${body}
    </>
  );
}`
}

// Export a single, self-contained HTML file using CDN Tailwind for classes
export function generateStandaloneHTML(
  title: string,
  rootId: string,
  nodes: Node<CompNodeData>[],
  edges: Edge[],
): string {
  const nodesMap = new Map(nodes.map((n) => [n.id, n] as const))
  const childrenOf = computeChildrenMap(edges)
  const esc = (s: string) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")

  const emit = (id: string): string => {
    const n = nodesMap.get(id)
    if (!n) return ""
    const d = n.data as CompNodeData
    const p: any = d.props || {}
    const style = p.styleJson && p.styleJson !== "{}" ? ` style='${esc(p.styleJson)}'` : ""
    const cls = p.className ? ` class='${esc(p.className)}'` : ""
    const kids = (childrenOf[id] || []).filter((cid) => (nodesMap.get(cid)?.data.type as any) !== "preview")
    const child = kids.map(emit).join("\n")

    switch (d.type) {
      case "section":
        return `<section style='background:${esc(p.background)};padding:${p.padding}px' class='w-full flex ${
          p.align === "center" ? "justify-center" : p.align === "right" ? "justify-end" : "justify-start"
        }'>
  <div style='max-width:${p.maxWidth}px'${cls}${style}>${child}</div>
</section>`
      case "row":
        return `<div class='flex flex-row ${p.justify ? `justify-${p.justify}` : "justify-start"} ${
          p.align ? `items-${p.align}` : "items-start"
        } ${esc(p.className || "")} ' style='gap:${p.gap}px;padding:${p.padding}px'${style}>${child}</div>`
      case "column":
        return `<div class='flex flex-col ${p.justify ? `justify-${p.justify}` : "justify-start"} ${
          p.align ? `items-${p.align}` : "items-start"
        } ${esc(p.className || "")} ' style='gap:${p.gap}px;padding:${p.padding}px'${style}>${child}</div>`
      case "text":
        return `<${p.tag || "p"} style='font-size:${p.fontSize}px;color:${esc(p.color)};font-weight:${p.weight};text-align:${esc(
          p.align,
        )}'${cls}${style}>${esc(p.content)}</${p.tag || "p"}>`
      case "image":
        return `<img src='${esc(p.src)}' alt='${esc(p.alt)}' width='${p.width}' height='${p.height}' style='border-radius:${p.rounded}px'${cls}${style}/>`
      case "button": {
        const pad = p.size === "sm" ? "px-3 py-1.5" : p.size === "lg" ? "px-6 py-3" : "px-4 py-2"
        return `<a href='${esc(p.href)}' class='inline-block bg-black text-white ${pad} ${esc(
          p.className || "",
        )} ' style='border-radius:${p.rounded}px'${style}>${esc(p.label)}</a>`
      }
      case "card":
        return `<div class='rounded-2xl border shadow-sm bg-white ${esc(p.className || "")} ' style='padding:${p.padding}px'${style}>${
          p.title ? `<div class='text-sm font-semibold mb-1'>${esc(p.title)}</div>` : ""
        }${p.description ? `<div class='text-xs text-gray-600'>${esc(p.description)}</div>` : ""}<div class='mt-2'>${child}</div></div>`
      case "badge":
        return `<span class='inline-block text-[10px] px-2 py-1 rounded ${esc(
          p.variant === "destructive"
            ? "bg-red-100 text-red-700"
            : p.variant === "secondary"
              ? "bg-gray-100 text-gray-700"
              : p.variant === "outline"
                ? "border text-gray-700"
                : "bg-black text-white",
        )} ${esc(p.className || "")} '>${esc(p.text)}</span>`
      case "avatar":
        return `<img src='${esc(p.src)}' alt='${esc(p.alt)}' style='width:${p.size}px;height:${p.size}px;border-radius:${p.rounded}px'${cls}${style}/>`
      case "alert": {
        const palette =
          p.variant === "success"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : p.variant === "warning"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : p.variant === "destructive"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
        return `<div class='border rounded-xl p-3 ${palette} ${esc(p.className || "")} '${style}>${
          p.title ? `<div class='text-sm font-semibold'>${esc(p.title)}</div>` : ""
        }${p.description ? `<div class='text-xs opacity-80'>${esc(p.description)}</div>` : ""}<div class='mt-2'>${child}</div></div>`
      }
      case "separator":
        return p.orientation === "vertical"
          ? `<div class='${esc(p.className || "")} ' style='width:${p.thickness}px;background:${esc(p.color)}'${style}/>`
          : `<div class='${esc(p.className || "")} ' style='height:${p.thickness}px;background:${esc(p.color)}'${style}/>`
      default:
        return ""
    }
  }

  const htmlBody = emit(rootId)
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${title}</title>
  <link rel="preconnect" href="https://esm.sh"/>
  <script type="module">
    import "https://cdn.tailwindcss.com";
  </script>
  <style>body{margin:0;padding:2rem;background:#f6f7f9;font-family:ui-sans-serif,system-ui,sans-serif}</style>
</head>
<body>
  <div id="app">${htmlBody}</div>
</body>
</html>`
}

export function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
