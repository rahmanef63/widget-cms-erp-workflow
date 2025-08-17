# Migration Guide: Unified Widget Architecture

## Overview

This guide explains how to migrate from the old widget system to the new unified architecture that eliminates widget overlap and provides profile-based rendering.

## Key Changes

### Before: Overlapping Widgets
\`\`\`typescript
// OLD: Duplicate widgets for same content
const headingWidget = { type: 'atoms/heading', level: 1, content: 'Title' }
const typographyWidget = { type: 'shadcn/typography', variant: 'h1', content: 'Title' }
\`\`\`

### After: Unified Architecture
\`\`\`typescript
// NEW: Single widget with dual rendering
const textWidget = { 
  type: 'text', 
  role: 'heading', 
  level: 1, 
  content: 'Title',
  tone: 'default'
}

// Renders as <h1>Title</h1> in semantic profile
// Renders as <h1 className="...">Title</h1> in shadcn profile
\`\`\`

## Migration Steps

### 1. Update Widget Definitions

#### Old Format
\`\`\`typescript
export const headingWidget = {
  type: "heading",
  label: "Heading",
  category: "atom",
  defaultProps: { content: "Heading", level: 2 },
  propertySchema: [
    { key: "content", label: "Content", type: "text" },
    { key: "level", label: "Level", type: "select", options: [1,2,3,4,5,6] }
  ]
}
\`\`\`

#### New Format
\`\`\`typescript
export const textWidgetDefinition = {
  type: 'text',
  name: 'Text',
  description: 'Unified text widget',
  category: 'atom',
  
  defaultProps: {
    role: 'heading',
    content: 'Heading',
    level: 2,
    tone: 'default'
  },
  
  schema: TextNodeSchema,
  
  propertyGroups: {
    content: {
      title: 'Content',
      alwaysVisible: true,
      properties: ['content']
    },
    semantics: {
      title: 'Semantics', 
      visibleInProfile: ['semantic'],
      properties: ['role', 'level']
    },
    presentation: {
      title: 'Presentation',
      visibleInProfile: ['shadcn'], 
      properties: ['tone']
    }
  }
}
\`\`\`

### 2. Update Renderers

#### Old Approach
\`\`\`typescript
// Separate components for same content
function HeadingWidget({ props }) {
  return <h1>{props.content}</h1>
}

function TypographyWidget({ props }) {
  return <h1 className="text-4xl font-bold">{props.content}</h1>
}
\`\`\`

#### New Approach
\`\`\`typescript
// Single component with profile-based rendering
function UnifiedText({ node }) {
  const profile = useRenderProfile()
  
  return profile === 'semantic' 
    ? <SemanticText node={node} />
    : <ShadcnText node={node} />
}
\`\`\`

### 3. Update Property Inspectors

#### Old Approach
\`\`\`typescript
// Separate property panels for each widget
function HeadingPropertyPanel({ widget, onChange }) {
  return (
    <div>
      <input value={widget.props.content} onChange={...} />
      <select value={widget.props.level} onChange={...} />
    </div>
  )
}
\`\`\`

#### New Approach
\`\`\`typescript
// Profile-aware property inspector with tabs
function TextPropertyInspector({ node, onChange }) {
  const profile = useRenderProfile()
  
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        {profile === 'semantic' && <TabsTrigger value="semantics">Semantics</TabsTrigger>}
        {profile === 'shadcn' && <TabsTrigger value="presentation">Presentation</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="content">
        <textarea value={node.content} onChange={...} />
      </TabsContent>
      
      {profile === 'semantic' && (
        <TabsContent value="semantics">
          <select value={node.role} onChange={...} />
          <select value={node.level} onChange={...} />
        </TabsContent>
      )}
      
      {profile === 'shadcn' && (
        <TabsContent value="presentation">
          <select value={node.tone} onChange={...} />
        </TabsContent>
      )}
    </Tabs>
  )
}
\`\`\`

### 4. Add Render Provider

Wrap your preview/editor with the render provider:

\`\`\`typescript
// In your CMS page/component
function CMSEditor() {
  const [profile, setProfile] = useState<RenderProfile>('semantic')
  
  return (
    <RenderProvider profile={profile}>
      <div>
        <ProfileSwitcher onProfileChange={setProfile} />
        <CanvasArea />
        <PropertyInspector />
      </div>
    </RenderProvider>
  )
}
\`\`\`

## Data Migration

### Automatic Migration
\`\`\`typescript
// Migrate old heading widgets to new text widgets
function migrateHeadingWidget(oldWidget: any): TextNode {
  return {
    id: oldWidget.id,
    type: 'text',
    role: 'heading',
    level: oldWidget.props.level || 2,
    content: oldWidget.props.content || '',
    tone: 'default'
  }
}

// Migrate old typography widgets to new text widgets  
function migrateTypographyWidget(oldWidget: any): TextNode {
  const variantToLevel = {
    'h1': 1, 'h2': 2, 'h3': 3, 'h4': 4, 'h5': 5, 'h6': 6
  }
  
  return {
    id: oldWidget.id,
    type: 'text',
    role: 'heading',
    level: variantToLevel[oldWidget.props.variant] || 2,
    content: oldWidget.props.content || '',
    tone: oldWidget.props.tone || 'default'
  }
}
\`\`\`

## Widget Registry Updates

### Old Registry
\`\`\`typescript
const WIDGET_REGISTRY = {
  'atoms/heading': HeadingWidget,
  'shadcn/typography': TypographyWidget,
}
\`\`\`

### New Registry
\`\`\`typescript
const UNIFIED_WIDGET_REGISTRY = {
  'text': {
    definition: textWidgetDefinition,
    component: UnifiedText,
    inspector: TextPropertyInspector
  }
}
\`\`\`

## Benefits of Migration

1. **No Widget Overlap**: Eliminates confusion between duplicate widgets
2. **Profile Flexibility**: Same content renders as semantic HTML or styled components
3. **Better DX**: Single source of truth for text content
4. **Type Safety**: Full TypeScript support with validation
5. **Future Proof**: Easy to extend with new render profiles
6. **Automatic Inheritance**: ShadCN components inherit semantic properties
7. **Error Isolation**: Widget failures don't cascade

## Testing the Migration

1. Create a test page with the UnifiedTextDemo component
2. Verify profile switching works correctly
3. Test property inspector tab visibility
4. Validate all text roles render properly
5. Ensure backward compatibility with existing content

## Rollback Plan

If issues arise, the old widget system remains available:

\`\`\`typescript
// Temporary: Use both systems during transition
const isUnifiedArchitectureEnabled = process.env.ENABLE_UNIFIED_WIDGETS === 'true'

const widgetComponent = isUnifiedArchitectureEnabled 
  ? UNIFIED_WIDGET_REGISTRY[widget.type]?.component
  : LEGACY_WIDGET_REGISTRY[widget.type]
\`\`\`

## Next Steps

1. Implement unified architecture for other widget types (Button, Card, etc.)
2. Add validation rules (H1 limit, heading hierarchy)
3. Implement multi-format import/export
4. Add error isolation and recovery
5. Create migration tools for existing content
