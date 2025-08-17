import type { TextNode } from "./unified-widget-system"
import type { JSX } from "react/jsx-runtime" // Declaring JSX variable

export function SemanticText({ node }: { node: TextNode }) {
  switch (node.role) {
    case "heading": {
      const Tag = `h${node.level ?? 2}` as keyof JSX.IntrinsicElements
      return <Tag>{node.content}</Tag>
    }
    case "paragraph":
      return <p>{node.content}</p>
    case "blockquote":
      return (
        <blockquote>
          <p>{node.content}</p>
        </blockquote>
      )
    case "inlineCode":
      return <code>{node.content}</code>
    case "list": {
      const List = (node.listType === "ol" ? "ol" : "ul") as "ul" | "ol"
      return (
        <List>
          {node.items?.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </List>
      )
    }
    case "table": {
      const head = node.headerRows ?? 1
      const rows = node.rows ?? []
      return (
        <figure>
          <table>
            {node.caption && <caption>{node.caption}</caption>}
            {head > 0 && (
              <thead>
                {rows.slice(0, head).map((r, ri) => (
                  <tr key={`h${ri}`}>
                    {r.map((c, ci) => (
                      <th key={ci} scope="col">
                        {c}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            )}
            <tbody>
              {rows.slice(head).map((r, ri) => (
                <tr key={`b${ri}`}>
                  {r.map((c, ci) => (
                    <td key={ci}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )
    }
    default:
      return null
  }
}
