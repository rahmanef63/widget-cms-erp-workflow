export const CMS_TOOL_MANIFEST = `
TOOLS AVAILABLE

1) createSchema
- Purpose: Build a CMS page schema using ReactFlow nodes/edges.
- Direction: Edges represent child -> parent.
- Preview rule: Ensure at least one ROOT node connects to target id 'preview' via an edge.
- Keep the graph minimal and sensible.

INPUT (arguments object):
{
  "title": string (optional),
  "nodes": Array<{
    "id": string,
    "type"?: "component",           // ReactFlow node type; optional when using "rfType"
    "rfType"?: "component",         // Use this when exporting/importing schemas
    "position": { "x": number, "y": number },
    "data": {
      "type": "section"|"row"|"column"|"text"|"image"|"button"|"card"|"badge"|"avatar"|"alert"|"separator",
      "label": string,
      "props": Record<string, any>
    }
  }>,
  "edges": Array<{
    "id": string,
    "source": string,  // child node id
    "target": string   // parent node id
  }>
}

NOTES:
- Use "type":"component" or "rfType":"component" for ReactFlow node type.
- The rendering order of siblings is determined by ascending position.x of child nodes under the same parent.
- Common props:
  section: background, padding, maxWidth, align
  row/column: gap, padding, justify(start|center|between|end), align(start|center|end)
  text: tag(h1..h6|p), content, fontSize, color, weight, align
  image: src, alt, width, height, rounded
  button: label, href, size(sm|md|lg), rounded
  card: title, description, padding
  badge: text, variant(default|secondary|destructive|outline)
  avatar: src, alt, size, rounded
  alert: variant(info|success|warning|destructive), title, description
  separator: orientation(horizontal|vertical), thickness, color
- All components support className and styleJson (JSON string) for custom style.

EXAMPLE A (Hero minimal):
{
  "nodes": [
    {
      "id": "section-hero",
      "rfType": "component",
      "position": { "x": 200, "y": 100 },
      "data": {
        "type": "section",
        "label": "section",
        "props": { "background": "#ffffff", "padding": 48, "maxWidth": 1024, "align": "center", "className": "", "styleJson": "{}" }
      }
    },
    {
      "id": "col-hero",
      "rfType": "component",
      "position": { "x": 200, "y": 150 },
      "data": {
        "type": "column",
        "label": "column",
        "props": { "gap": 16, "padding": 0, "justify": "center", "align": "center", "className": "", "styleJson": "{}" }
      }
    },
    {
      "id": "title",
      "rfType": "component",
      "position": { "x": 200, "y": 200 },
      "data": {
        "type": "text",
        "label": "text",
        "props": { "tag": "h1", "content": "A Better Way to Build", "fontSize": 36, "color": "#111827", "weight": 700, "align": "center", "className": "", "styleJson": "{}" }
      }
    },
    {
      "id": "subtitle",
      "rfType": "component",
      "position": { "x": 200, "y": 240 },
      "data": {
        "type": "text",
        "label": "text",
        "props": { "tag": "p", "content": "Generated from your prompt.", "fontSize": 16, "color": "#374151", "weight": 400, "align": "center", "className": "", "styleJson": "{}" }
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "col-hero", "target": "section-hero" },
    { "id": "e2", "source": "title", "target": "col-hero" },
    { "id": "e3", "source": "subtitle", "target": "col-hero" },
    { "id": "e4", "source": "section-hero", "target": "preview" }
  ]
}

EXAMPLE B (Pricing 3 kolom, ringkas):
- section(center) > row(center) > (card x3)
- Pastikan edge source=card-id, target=row-id; lalu row -> section; section -> preview.

REMINDER:
- Always call the createSchema tool and return only valid arguments per input schema.
- Do not output natural language responses alongside the tool call.
`.trim()
