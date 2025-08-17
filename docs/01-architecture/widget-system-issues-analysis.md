# Widget System Issues Analysis

## Overview
This document analyzes the critical issues identified in the `features/cms/widgets/` folder and provides the comprehensive unified widget architecture solution.

## Critical Issues Identified

### 1. Widget Overlap Problem (NEW CRITICAL ISSUE)
**Location**: `features/cms/widgets/atoms/` vs `features/cms/widgets/shadcn/`
**Problem**: Duplicate widgets for same semantic content (atoms/heading vs shadcn/typography)
**Impact**: Confusion, maintenance overhead, inconsistent behavior
**Priority**: CRITICAL

### 2. Deep Nested Object Hell in Complex Widgets
**Location**: `features/cms/widgets/collections/complex-widgets.ts`
**Problem**: 5-7 levels deep nested object structures
**Impact**: Unmaintainable, error-prone, poor developer experience
**Priority**: HIGH

### 3. Magic String Property Paths
**Problem**: `"composition.props.children.0.children.0.props.content"`
**Impact**: No compile-time safety, runtime errors
**Priority**: HIGH

### 4. Hardcoded Tailwind Classes
**Problem**: CSS classes scattered throughout widget definitions
**Impact**: No design system consistency, impossible to theme
**Priority**: MEDIUM

### 5. Inconsistent Widget Structure
**Problem**: Some widgets have PropertyPanel.tsx, others don't
**Impact**: Confusing API, hard to maintain
**Priority**: MEDIUM

### 6. No Widget Validation System
**Problem**: No validation for widget properties
**Impact**: Runtime crashes, invalid states
**Priority**: HIGH

### 7. Weak TypeScript Typing
**Problem**: Widget definitions use `any` types
**Impact**: No type safety, poor IDE support
**Priority**: HIGH

### 8. Massive Code Duplication
**Problem**: Similar widgets repeat patterns
**Impact**: Maintenance nightmare, bugs multiply
**Priority**: MEDIUM

### 9. No Widget Versioning or Migration
**Problem**: No system for handling schema changes
**Impact**: Breaking changes, data loss
**Priority**: HIGH

### 10. Tightly Coupled Property Schemas
**Problem**: Property schemas coupled to DOM structures
**Impact**: Fragile, inflexible, poor separation
**Priority**: MEDIUM

### 11. No Composition or Extension Patterns
**Problem**: Monolithic widget definitions
**Impact**: Can't create variants, poor scalability
**Priority**: HIGH

## Unified Widget Architecture Solution

### Core Principle: Separate Semantic from Presentation

**Key Insight**: Separate "meaning" (semantic) from "appearance" (ShadCN) using one data model with two different renderers.

### Anti-Overlap Rules

1. **One text widget family only**: `text` with role-based rendering
2. **Clear namespace separation**:
   - `atoms/*` = HTML semantic output (`h1-h6`, `p`, `blockquote`, `ul/ol`, `table`)
   - `shadcn/*` = ShadCN component output (`Lead`, `Muted`, variants)
3. **Three property categories**:
   - **Content** (text, items, cells) - always available
   - **Semantics** (role, level, listType) - only active in `atoms`
   - **Presentation** (variant, size, tone) - only active in `shadcn`

### Canonical Schema (Single Source of Truth)

\`\`\`typescript
export type TextRole = 'heading'|'paragraph'|'blockquote'|'list'|'table'|'inlineCode';

export interface TextNode {
  id: string;
  type: 'text';
  role: TextRole;
  level?: 1|2|3|4|5|6;           // only role=heading
  listType?: 'ul'|'ol';          // only role=list
  rows?: string[][];             // only role=table
  headerRows?: number;           // table thead split
  caption?: string;              // table/figure caption
  datetime?: string;             // <time> support (ISO)
  content?: string;              // p/blockquote/inlineCode/heading
  items?: string[];              // list content
  // presentational "hints" neutral, tidak kelas spesifik
  tone?: 'default'|'muted'|'lead'|'large'|'small';  // optional
}
\`\`\`

### Dual Renderer Architecture

\`\`\`typescript
export type RenderProfile = 'semantic' | 'shadcn';
const RendererContext = React.createContext<RenderProfile>('semantic');
export const useRenderProfile = () => React.useContext(RendererContext);

// Unified Text component with dual rendering
export function Text({ node }: { node: TextNode }) {
  const profile = useRenderProfile();
  return profile === 'semantic'
    ? <SemanticText node={node}/>
    : <ShadcnText node={node}/>;
}
\`\`\`

### Semantic Adapter (HTML + Accessibility)

\`\`\`typescript
function SemanticText({ node }: { node: TextNode }) {
  switch (node.role) {
    case 'heading': {
      const Tag = (`h${node.level ?? 2}`) as keyof JSX.IntrinsicElements;
      return <Tag>{node.content}</Tag>;
    }
    case 'paragraph':
      return <p>{node.content}</p>;
    case 'blockquote':
      return <blockquote><p>{node.content}</p></blockquote>;
    case 'inlineCode':
      return <code>{node.content}</code>;
    case 'list': {
      const List = (node.listType === 'ol' ? 'ol' : 'ul') as 'ul'|'ol';
      return <List>{node.items?.map((t,i)=><li key={i}>{t}</li>)}</List>;
    }
    case 'table': {
      const head = node.headerRows ?? 1;
      const rows = node.rows ?? [];
      return (
        <figure>
          <table>
            {node.caption && <caption>{node.caption}</caption>}
            {head>0 && (
              <thead>
                {rows.slice(0, head).map((r,ri)=>(
                  <tr key={`h${ri}`}>{r.map((c,ci)=><th key={ci} scope="col">{c}</th>)}</tr>
                ))}
              </thead>
            )}
            <tbody>
              {rows.slice(head).map((r,ri)=>(
                <tr key={`b${ri}`}>{r.map((c,ci)=><td key={ci}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </figure>
      );
    }
  }
}
\`\`\`

### ShadCN Adapter (Design System Components)

\`\`\`typescript
function ShadcnText({ node }: { node: TextNode }) {
  const tone = node.tone ?? 'default';

  if (node.role === 'heading') {
    const lv = node.level ?? 2;
    const cls = {
      1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance",
      2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      4: "scroll-m-20 text-xl font-semibold tracking-tight",
      5: "text-lg font-semibold",
      6: "text-base font-semibold",
    }[lv];
    const Tag = (`h${lv}`) as const;
    return <Tag className={cls}>{node.content}</Tag>;
  }

  if (node.role === 'paragraph') {
    const map = {
      lead:  "text-muted-foreground text-xl",
      large: "text-lg font-semibold",
      small: "",
      muted: "text-muted-foreground text-sm",
      default: "leading-7 [&:not(:first-child)]:mt-6",
    } as const;
    const cls = tone === 'small' ? "text-sm leading-none font-medium" : map[tone];
    const Comp = tone === 'small' ? 'small' : 'p';
    return <Comp className={cls}>{node.content}</Comp>;
  }

  if (node.role === 'blockquote') {
    return <blockquote className="mt-6 border-l-2 pl-6 italic">{node.content}</blockquote>;
  }

  if (node.role === 'inlineCode') {
    return <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{node.content}</code>;
  }

  if (node.role === 'list') {
    const cls = "my-6 ml-6 list-disc [&>li]:mt-2";
    return node.listType === 'ol'
      ? <ol className={cls}>{node.items?.map((t,i)=><li key={i}>{t}</li>)}</ol>
      : <ul className={cls}>{node.items?.map((t,i)=><li key={i}>{t}</li>)}</ul>;
  }

  return null;
}
\`\`\`

### Property Inspector Architecture

\`\`\`typescript
interface PropertyInspectorProps {
  node: TextNode;
  profile: RenderProfile;
  onChange: (node: TextNode) => void;
}

export function TextPropertyInspector({ node, profile, onChange }: PropertyInspectorProps) {
  return (
    <div className="space-y-4">
      {/* Content Tab - Always Available */}
      <ContentTab node={node} onChange={onChange} />
      
      {/* Semantics Tab - Only for semantic profile */}
      {profile === 'semantic' && (
        <SemanticsTab node={node} onChange={onChange} />
      )}
      
      {/* Presentation Tab - Only for shadcn profile */}
      {profile === 'shadcn' && (
        <PresentationTab node={node} onChange={onChange} />
      )}
    </div>
  );
}
\`\`\`

## Implementation Checklist

### Phase 1: Foundation
- [ ] Add `RenderProfile` context + provider in preview
- [ ] Create unified `TextNode` schema with Zod validation
- [ ] Build `SemanticText` & `ShadcnText` adapters
- [ ] Convert existing ShadCN Typography to adapter pattern

### Phase 2: Property Inspector Migration
- [ ] Create separated property inspector tabs (Content/Semantics/Presentation)
- [ ] Implement profile-based tab activation
- [ ] Add validation rules (H1 limit, heading hierarchy, table checks)

### Phase 3: Widget Registry Integration
- [ ] Update registry: `atoms/text` → `SemanticText`, `shadcn/typography` → `ShadcnText`
- [ ] Both consume same `TextNode` schema
- [ ] Remove duplicate widget definitions

### Phase 4: Migration & Cleanup
- [ ] Create migrator: old `shadcn/typography` → `text` + `tone`
- [ ] Add linter rules (H1 single, heading order, table validation)
- [ ] Remove legacy typography widgets

## Benefits of Unified Architecture

1. **No Overlap**: Single node type, dual renderers eliminate duplication
2. **Maximum Flexibility**: Semantic for SEO/a11y, ShadCN for rich UI
3. **DRY & Safe**: Single schema + migrator system
4. **Type Safety**: Full TypeScript coverage with Zod validation
5. **Future Proof**: Easy to extend with new render profiles

## Validation Rules

- **H1 Limit**: Maximum one `heading level=1` per page
- **Table Validation**: `headerRows ≤ rows.length`
- **DateTime**: ISO format required for time elements
- **Heading Hierarchy**: No large jumps (h2→h4 warning)
- **Accessibility**: Proper ARIA attributes and semantic structure

## Solution Architecture

### Phase 1: Foundation (Current Task)
- Create widget validation system with Zod
- Implement widget builder pattern
- Add strict TypeScript typing

### Phase 2: Refactoring
- Refactor existing widgets
- Create composition patterns
- Add versioning system

### Phase 3: Enhancement
- Update property panels
- Add design token system
- Implement migration tools

## Folder Organization with Prefixes

\`\`\`
features/cms/widgets/
├── core/           # Core widget system
├── atoms/          # Atomic widgets (Button, Input, etc.)
├── molecules/      # Molecule widgets (Card, Form, etc.)
├── organisms/      # Organism widgets (Header, Footer, etc.)
├── templates/      # Template widgets (Page layouts, etc.)
├── shadcn/         # ShadCN component widgets
├── collections/    # Complex widget collections
├── shared/         # Shared utilities and types
└── migrations/     # Widget migration scripts
