# Common Questions

## CMS Builder Questions

### How do I display results in Preview?
Ensure at least one root node is connected to the node with id 'preview' (edge: source=<root>, target='preview').

### How is child order determined within a parent?
Determined by the ascending position.x value of children (leftmost renders first).

### Why isn't my component showing up?
Check these common issues:
- Node is connected to parent via edges
- Node position is within visible bounds
- Node data contains required properties
- No validation errors in component definition

### How do I add custom styling?
Use the styleJson property or className field in component props to add custom CSS.

### Can I import existing components?
Yes, use the import functionality to bring in components from JSON or other formats.

### How do I export my layout?
Use the export tools to generate JSON, HTML, or component code from your layout.

### What file formats are supported?
- JSON for layout data
- HTML for static output
- TypeScript/React for component code
- CSS for styling

### How do I debug layout issues?
- Use the inspector panel to examine node properties
- Check the browser console for errors
- Validate your layout structure
- Test with simplified components first
