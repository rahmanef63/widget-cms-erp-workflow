"use client"
import type { TextNode } from "../../../core/unified-widget-system"
import { useRenderProfile } from "../../../core/render-context"
import { AutoPropertyInspectorInheritance } from "../../../core/property-inspector-inheritance"

interface UnifiedTextPropertyInspectorProps {
  node: TextNode
  onChange: (node: TextNode) => void
}

const inheritance = new AutoPropertyInspectorInheritance()

export function UnifiedTextPropertyInspector({ node, onChange }: UnifiedTextPropertyInspectorProps) {
  const profile = useRenderProfile()

  const contentProps = inheritance.getContentProperties(node.role)
  const semanticProps = inheritance.getSemanticProperties(node.role)
  const presentationProps = inheritance.getPresentationProperties(node.role)

  const updateNode = (updates: Partial<TextNode>) => {
    onChange({ ...node, ...updates })
  }

  return (
    <div className="space-y-6">
      {/* Content Tab - Always Available */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Content</h3>

        {contentProps.includes("content") && (
          <div>
            <label className="text-xs text-muted-foreground">Content</label>
            <textarea
              value={node.content || ""}
              onChange={(e) => updateNode({ content: e.target.value })}
              className="w-full p-2 border rounded text-sm"
              rows={3}
            />
          </div>
        )}

        {contentProps.includes("items") && (
          <div>
            <label className="text-xs text-muted-foreground">List Items</label>
            {node.items?.map((item, index) => (
              <input
                key={index}
                value={item}
                onChange={(e) => {
                  const newItems = [...(node.items || [])]
                  newItems[index] = e.target.value
                  updateNode({ items: newItems })
                }}
                className="w-full p-2 border rounded text-sm mb-2"
              />
            ))}
            <button
              onClick={() => updateNode({ items: [...(node.items || []), ""] })}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Add Item
            </button>
          </div>
        )}
      </div>

      {/* Semantics Tab - Only for semantic profile */}
      {profile === "semantic" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Semantics</h3>

          <div>
            <label className="text-xs text-muted-foreground">Role</label>
            <select
              value={node.role}
              onChange={(e) => updateNode({ role: e.target.value as any })}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="heading">Heading</option>
              <option value="paragraph">Paragraph</option>
              <option value="blockquote">Blockquote</option>
              <option value="list">List</option>
              <option value="table">Table</option>
              <option value="inlineCode">Inline Code</option>
            </select>
          </div>

          {node.role === "heading" && (
            <div>
              <label className="text-xs text-muted-foreground">Level</label>
              <select
                value={node.level || 2}
                onChange={(e) => updateNode({ level: Number.parseInt(e.target.value) as any })}
                className="w-full p-2 border rounded text-sm"
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    H{level}
                  </option>
                ))}
              </select>
            </div>
          )}

          {node.role === "list" && (
            <div>
              <label className="text-xs text-muted-foreground">List Type</label>
              <select
                value={node.listType || "ul"}
                onChange={(e) => updateNode({ listType: e.target.value as "ul" | "ol" })}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="ul">Unordered List</option>
                <option value="ol">Ordered List</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Presentation Tab - Only for shadcn profile */}
      {profile === "shadcn" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Presentation</h3>

          <div>
            <label className="text-xs text-muted-foreground">Tone</label>
            <select
              value={node.tone || "default"}
              onChange={(e) => updateNode({ tone: e.target.value as any })}
              className="w-full p-2 border rounded text-sm"
            >
              <option value="default">Default</option>
              <option value="lead">Lead</option>
              <option value="large">Large</option>
              <option value="small">Small</option>
              <option value="muted">Muted</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
