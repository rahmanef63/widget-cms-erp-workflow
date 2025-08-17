import type { TextNode } from "./unified-widget-system"

export function ShadcnText({ node }: { node: TextNode }) {
  const tone = node.tone ?? "default"

  if (node.role === "heading") {
    const lv = node.level ?? 2
    const cls = {
      1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
      2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      4: "scroll-m-20 text-xl font-semibold tracking-tight",
      5: "text-lg font-semibold",
      6: "text-base font-semibold",
    }[lv]
    const Tag = `h${lv}` as const
    return <Tag className={cls}>{node.content}</Tag>
  }

  if (node.role === "paragraph") {
    const map = {
      lead: "text-muted-foreground text-xl",
      large: "text-lg font-semibold",
      small: "",
      muted: "text-muted-foreground text-sm",
      default: "leading-7 [&:not(:first-child)]:mt-6",
    } as const
    const cls = tone === "small" ? "text-sm leading-none font-medium" : map[tone]
    const Comp = tone === "small" ? "small" : "p"
    return <Comp className={cls}>{node.content}</Comp>
  }

  if (node.role === "blockquote") {
    return <blockquote className="mt-6 border-l-2 pl-6 italic">{node.content}</blockquote>
  }

  if (node.role === "inlineCode") {
    return (
      <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {node.content}
      </code>
    )
  }

  if (node.role === "list") {
    const cls = "my-6 ml-6 list-disc [&>li]:mt-2"
    return node.listType === "ol" ? (
      <ol className={cls}>
        {node.items?.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ol>
    ) : (
      <ul className={cls}>
        {node.items?.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    )
  }

  return null
}
