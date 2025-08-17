# CMS Widget System - Comprehensive System Design

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Analysis & Critical Issues](#architecture-analysis--critical-issues)
3. [Unified Widget Architecture Solution](#unified-widget-architecture-solution)
4. [Implementation Patterns](#implementation-patterns)
5. [Validation System](#validation-system)
6. [Migration & Versioning](#migration--versioning)
7. [Folder Structure & Organization](#folder-structure--organization)
8. [Property Inspector System](#property-inspector-system)
9. [Refactoring Strategy & Implementation Plan](#refactoring-strategy--implementation-plan)
10. [Progress Tracking](#progress-tracking)

---

## Project Overview

This documentation consolidates all information about the CMS Widget System, a comprehensive solution for building modular, type-safe, and maintainable UI components with advanced property management and validation.

The project is a Next.js-based Content Management System (CMS) with node-based visual editor, integrated with advanced AI Agent capabilities. It allows users to build web pages visually and use AI to accelerate layout and content creation.

### Key Features
- **Modular Design**: Each widget is completely isolated with no cross-dependencies
- **Type Safety**: Full TypeScript coverage with Zod validation
- **AI Integration**: Advanced AI agent for layout and content generation
- **Composite Support**: Widgets can combine multiple property inspectors
- **Framework Integration**: Next.js optimized components in atoms category
- **Design System**: Consistent ShadCN/UI styling across components
- **DRY Principle**: Reusable property inspectors prevent code duplication

### Architecture Foundation
Built on Next.js with App Router, using feature-slicing architecture (`features/agent`, `features/cms`) that follows best practices. The widget system within the CMS is the core complex component and primary focus for improvement.

---

## Architecture Analysis & Critical Issues

### Critical Issues Identified

The comprehensive analysis revealed **11 critical issues** requiring resolution:

#### 🔴 NEW #1: Widget Overlap Problem (CRITICAL)
- **Problem**: Duplicate widgets for same semantic content (`atoms/heading` vs `shadcn/typography`)
- **Impact**: Developer confusion, maintenance overhead, inconsistent behavior
- **Priority**: CRITICAL
- **Solution**: Single `TextNode` schema with dual renderers

#### 🔴 High Priority Issues
2. **Deep Nested Object Hell** - 5-7 levels deep nested object structures in complex widgets
3. **Magic String Property Paths** - No compile-time safety for property access (`"composition.props.children.0.children.0.props.content"`)
4. **No Widget Validation System** - Runtime crashes from invalid states
5. **Weak TypeScript Typing** - Widget definitions use `any` types
6. **No Widget Versioning** - No system for handling schema changes

#### 🟡 Medium Priority Issues
7. **Hardcoded Tailwind Classes** - No design system consistency
8. **Inconsistent Widget Structure** - Mixed PropertyPanel usage
9. **Massive Code Duplication** - Similar widgets repeat patterns
10. **Tightly Coupled Property Schemas** - Poor separation of concerns
11. **No Composition Patterns** - Monolithic widget definitions

---

## Unified Widget Architecture Solution

### Core Principle: Semantic-Presentation Separation

The new architecture eliminates widget overlap by separating semantic meaning from visual presentation using a single data model with dual renderers.

#### Anti-Overlap Strategy

**Problem Solved**: Previously had duplicate widgets (`atoms/heading` vs `shadcn/typography`) causing confusion and maintenance overhead.

**Solution**: One widget type (`text`) with role-based rendering through two adapters:
- **Semantic Adapter**: Outputs proper HTML tags for SEO/accessibility
- **ShadCN Adapter**: Outputs styled components for rich UI

#### Unified TextNode Schema

```typescript
export interface TextNode {
  id: string;
  type: 'text';
  role: 'heading'|'paragraph'|'blockquote'|'list'|'table'|'inlineCode';
  level?: 1|2|3|4|5|6;           // heading levels
  listType?: 'ul'|'ol';          // list types
  rows?: string[][];             // table data
  headerRows?: number;           // table header rows
  caption?: string;              // table/figure caption
  datetime?: string;             // ISO datetime for time elements
  content?: string;              // text content
  items?: string[];              // list items
  tone?: 'default'|'muted'|'lead'|'large'|'small';  // presentation hint
}
```

#### Render Profile System

```typescript
export type RenderProfile = 'semantic' | 'shadcn';

// Usage in preview
<RendererProvider profile="semantic">  {/* For blog/SEO pages */}
  <PageRenderer />
</RendererProvider>

<RendererProvider profile="shadcn">    {/* For marketing/UI pages */}
  <PageRenderer />
</RendererProvider>
```

#### Dual Renderer Architecture

```typescript
// Unified Text component with profile-based rendering
export function Text({ node }: { node: TextNode }) {
  const profile = useRenderProfile();
  return profile === 'semantic'
    ? <SemanticText node={node}/>
    : <ShadcnText node={node}/>;
}
```

#### Property Inspector Separation

**Three Property Categories:**
1. **Content** (always available): `content`, `items`, `rows`, `caption`
2. **Semantics** (semantic profile only): `role`, `level`, `listType`, `datetime`
3. **Presentation** (shadcn profile only): `tone`, styling options

### Import/Export Strategy (DRY & Dynamic)

#### Multi-Format Import
```typescript
// Import by widget ID (JSON reference)
const widget = importFromJson({ widgetId: "text-123" });

// Import from HTML directly
const widget = importFromHtml('<h1>My Title</h1>');
// Results in: { type: 'text', role: 'heading', level: 1, content: 'My Title' }
```

#### Multi-Format Export
```typescript
// Export to semantic HTML
const semanticHtml = exportToHtml(textNode, 'semantic');
// Output: <h1>My Title</h1>

// Export to styled HTML
const styledHtml = exportToHtml(textNode, 'shadcn');
// Output: <h1 class="scroll-m-20 text-4xl...">My Title</h1>

// Export to JSON and TypeScript
const json = exportToJson(textNode);
const ts = exportToTypeScript(textNode);
```

#### Automatic Property Inspector Inheritance

**ShadCN components automatically inherit properties from their semantic HTML base:**
```typescript
// Button inherits semantic button properties + adds presentation properties
const buttonProperties = {
  semantic: ['type', 'disabled', 'form', 'name'],  // HTML button attributes
  presentation: ['variant', 'size', 'tone'],       // ShadCN styling
  content: ['text', 'icon']                        // Content properties
};
```

#### Modular Error Handling

**Widget Isolation Strategy:**
```typescript
// Each widget is independent - errors don't cascade
try {
  renderWidget(widget);
} catch (error) {
  isolateWidget(widget.id, error);
  renderFallback(widget.id); // Fallback content
}
```

---

## Implementation Patterns

### Widget Builder Pattern

The Widget Builder Pattern provides a fluent API for creating widgets with proper validation and type safety.

#### Base Widget Interface
```typescript
interface BaseWidget {
  id: string
  type: string
  version: string
  props: Record<string, any>
  children?: BaseWidget[]
  metadata?: WidgetMetadata
}
```

#### Widget Builder Class
```typescript
class WidgetBuilder<T extends BaseWidget> {
  private widget: Partial<T>
  
  constructor(type: string) {
    this.widget = {
      id: generateId(),
      type,
      version: '1.0.0',
      props: {}
    }
  }
  
  addProp<K extends keyof T['props']>(key: K, value: T['props'][K]): this
  addClass(className: string): this
  addChild(child: BaseWidget): this
  validate(): ValidationResult
  build(): T
}
```

#### Usage Examples

**Enhanced Widget Builder with Unified Architecture:**
```typescript
const heading = new WidgetBuilder('text')
  .addProp('role', 'heading')
  .addProp('level', 1)
  .addProp('content', 'Welcome to Our Site')
  .addProp('tone', 'default')  // presentation hint
  .validate()
  .build()
```

**Complex Hero Section:**
```typescript
const heroSection = new WidgetBuilder('hero-section')
  .addChild(
    new WidgetBuilder('container')
      .addClass('max-w-4xl mx-auto')
      .addChild(
        new WidgetBuilder('text')
          .addProp('role', 'heading')
          .addProp('level', 1)
          .addProp('content', 'Welcome')
          .build()
      )
      .build()
  )
  .build()
```

---

## Validation System

### Overview
Comprehensive validation system using Zod schemas for runtime type safety and property validation.

#### Base Widget Schema
```typescript
const BaseWidgetSchema = z.object({
  id: z.string().uuid(),
  type: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  props: z.record(z.any()),
  children: z.array(z.lazy(() => BaseWidgetSchema)).optional(),
  metadata: z.object({
    createdAt: z.date(),
    updatedAt: z.date(),
    author: z.string().optional()
  }).optional()
})
```

#### Enhanced Validation with Unified Architecture

```typescript
const TextNodeSchema = BaseWidgetSchema.extend({
  type: z.literal('text'),
  role: z.enum(['heading', 'paragraph', 'blockquote', 'list', 'table', 'inlineCode']),
  level: z.number().min(1).max(6).optional(),
  tone: z.enum(['default', 'muted', 'lead', 'large', 'small']).optional(),
  // Custom validation rules
}).refine((data) => {
  // H1 limit validation
  if (data.role === 'heading' && data.level === 1) {
    return validateSingleH1(data);
  }
  return true;
});
```

#### Widget Validator
```typescript
export class WidgetValidator {
  static validate<T extends BaseWidget>(
    widget: unknown, 
    schema: z.ZodSchema<T>
  ): ValidationResult<T> {
    try {
      const validated = schema.parse(widget)
      return { success: true, data: validated }
    } catch (error) {
      return { 
        success: false, 
        errors: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      }
    }
  }
}
```

---

## Migration & Versioning

### Version Management

#### Widget Version Schema
```typescript
interface WidgetVersion {
  version: string
  schema: z.ZodSchema
  migrations: Migration[]
  deprecated?: boolean
  deprecationDate?: Date
}
```

#### Migration Interface
```typescript
interface Migration {
  fromVersion: string
  toVersion: string
  migrate: (oldWidget: any) => any
  rollback?: (newWidget: any) => any
}
```

### Migration Registry

#### Automatic Migration
```typescript
export class WidgetMigrator {
  static migrate(widget: any, targetVersion?: string): BaseWidget {
    const registry = WidgetVersionRegistry.getInstance()
    const currentVersion = widget.version || '1.0.0'
    const target = targetVersion || registry.getLatestVersion(widget.type)?.version
    
    if (!target) {
      throw new Error(`No target version found for widget type: ${widget.type}`)
    }
    
    const migrations = registry.getMigrationPath(widget.type, currentVersion, target)
    
    return migrations.reduce((w, migration) => migration.migrate(w), widget)
  }
}
```

---

## Folder Structure & Organization

### Proposed New Structure

```
├── README.md
├── docs/
│   └── SYSTEM_DESIGN.md         // [MERGED] Single comprehensive document
├── public/
├── app/
│   ├── api/
│   │   └── ai/                    // API routes
│   ├── (cms)/                     // Route groups for CMS
│   │   ├── build/page.tsx
│   │   └── builder/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── render/page.tsx
├── features/
│   ├── agent/                      // AI Agent feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── knowledge/             // [CONSOLIDATED] All agent knowledge & prompts
│   │   ├── lib/                   // Business logic
│   │   ├── models/                // AI model configurations
│   │   ├── server/                // Server-side logic
│   │   ├── tools/                 // AI tools definitions
│   │   └── types.ts
│   └── cms/                        // CMS feature
│       ├── ai/                    // AI logic specific to CMS
│       ├── components/            // Large UI components for CMS pages
│       ├── hooks/                 // CMS-specific hooks
│       ├── lib/                   // CMS business logic
│       ├── pages/                 // Main CMS page components
│       ├── providers/             // React Context Providers
│       ├── types/                 // CMS-specific types
│       └── widgets/               // [REFACTORED] Widget system
│           ├── core/              // Core system (builder, validator, etc.)
│           ├── definitions/       // [NEW] Widget schemas & configurations
│           │   ├── atoms/
│           │   ├── collections/
│           │   └── shadcn/
│           ├── inspector/         // [MOVED] Property panel components
│           │   ├── components/
│           │   └── tabs/
│           ├── renderers/         // [NEW] React render components
│           │   ├── atoms/
│           │   └── shadcn/
│           └── shared/            // Shared utilities & input components
├── components/
│   ├── app/                       // [SEPARATED] App-specific components
│   │   ├── app-sidebar.tsx
│   │   ├── nav-main.tsx
│   │   └── ...
│   └── ui/                        // [SEPARATED] Pure UI components (shadcn)
│       ├── button.tsx
│       └── ...
├── shared/                        // [CONSOLIDATED] All shared code
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── dnd/
├── styles/                        // [MOVED] All styling
│   └── globals.css
├── .gitignore
├── components.json
├── next.config.mjs
├── package.json
└── tsconfig.json
```

### Key Changes Made

#### 1. Consolidation & DRY Principle
- **MERGED**: `docs/COMPREHENSIVE_DOCUMENTATION.md`, `REFACTORING_PLAN.md`, `docs/01-architecture/widget-system-issues-analysis.md` → `docs/SYSTEM_DESIGN.md`
- **CONSOLIDATED**: `/hooks`, `/lib` → `/shared` (single source of truth)
- **UNIFIED**: Agent knowledge files → `features/agent/knowledge/`

#### 2. Widget System Refactoring
- **NEW**: `definitions/` - Widget schemas and configurations
- **NEW**: `renderers/` - React rendering components
- **MOVED**: Inspector components to widget system
- **SEPARATED**: Semantic vs ShadCN widget categories

#### 3. Component Organization
- **SEPARATED**: App components vs UI components
- **CLARIFIED**: Component responsibilities and boundaries

---

## Property Inspector System

### Modular Property Inspector Architecture

The property inspector system provides reusable, composable property editors that can be combined for complex widgets.

#### Modular Inspector System
```typescript
// Composite widget example: Form with input + button
const formInspectors = [
  'shadcn/input',     // Input field properties
  'shadcn/button',    // Submit button properties
  'atoms/div'         // Container properties
]

// System automatically combines all relevant property inspectors
<CompositePropertyInspector inspectors={formInspectors} />
```

#### Enhanced Property Inspector with Profile Separation

```typescript
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
```

### DRY Principle Implementation
- Each widget exports reusable property definitions
- Property inspectors can be mixed and matched
- No duplication of common properties (styling, layout, etc.)

---

## Refactoring Strategy & Implementation Plan

### Updated Priority: Unified Architecture First

#### Phase 1: Unified Architecture Foundation (NEW CRITICAL PRIORITY)
**Status**: 🔄 IN PROGRESS | **Priority**: CRITICAL | **Risk**: Medium

##### 1.1 Core Schema Implementation
- [ ] Create unified `TextNode` interface with role-based properties
- [ ] Implement Zod validation with semantic rules (H1 limit, heading hierarchy)
- [ ] Add render profile context system (`semantic` vs `shadcn`)

##### 1.2 Dual Renderer System
- [ ] Build `SemanticText` adapter (HTML tags + accessibility)
- [ ] Build `ShadcnText` adapter (styled components + design system)
- [ ] Create unified `Text` component with profile switching

##### 1.3 Property Inspector Separation
- [ ] **Content Tab**: Always available (content, items, rows, caption)
- [ ] **Semantics Tab**: Only active in semantic profile (role, level, listType)
- [ ] **Presentation Tab**: Only active in shadcn profile (tone, styling)

##### 1.4 Import/Export System
- [ ] Implement JSON import by widget ID reference
- [ ] Implement direct HTML import with DOM parsing
- [ ] Create multi-format export (HTML semantic, HTML styled, JSON, TypeScript)
- [ ] Add automatic property inspector inheritance system

##### 1.5 Modular Error Handling
- [ ] Implement widget isolation on errors
- [ ] Create fallback rendering system
- [ ] Add error recovery with graceful degradation

### Phase 2: ShadCN Expansion (UPDATED PRIORITY)
**Status**: 30% 🔄 | **Priority**: High | **Risk**: Low

#### Current Status: 3/40+ Components
- ✅ Typography → **MIGRATE TO UNIFIED ARCHITECTURE**
- ✅ Accordion → Keep as-is (no overlap)
- ✅ Button → Keep as-is (no overlap)

#### Next Priority: Non-Text Components Only
- [ ] Form & Input components (8 components) - No text overlap
- [ ] Layout & Navigation (8 components) - No text overlap
- [ ] Feedback & Status (6 components) - No text overlap

### Phase 3: Migration & Registry Update (UPDATED)
**Status**: 20% 🔄 | **Priority**: High | **Risk**: High

#### 3.1 Widget Registry Migration
- [ ] Update registry: `atoms/text` → `SemanticText` renderer
- [ ] Update registry: `shadcn/typography` → `ShadcnText` renderer
- [ ] Both consume same `TextNode` schema
- [ ] Remove duplicate widget definitions

#### 3.2 Content Migration
- [ ] Create migrator: old typography widgets → unified `TextNode`
- [ ] Preserve existing content and styling preferences
- [ ] Add backward compatibility layer during transition

### Phase 4: Advanced Features (UPDATED)
**Status**: 0% ❌ | **Priority**: Medium | **Risk**: Low

#### 4.1 Validation & Linting
- [ ] H1 limit enforcement (max 1 per page)
- [ ] Heading hierarchy validation (no large jumps)
- [ ] Table structure validation (headerRows ≤ rows.length)
- [ ] Accessibility compliance checking

#### 4.2 Enhanced Features
- [ ] DateTime support for time elements (ISO format)
- [ ] Table caption and accessibility features
- [ ] Rich text editing for content fields
- [ ] Preview mode switching (semantic ↔ shadcn)

---

## Progress Tracking

### 📊 Overall Progress: 45% Complete (Revised with New Priority)

#### **Phase 1 (Unified Architecture)**: 0% ❌ NEW CRITICAL PRIORITY
- Unified Schema: 0% ❌
- Dual Renderers: 0% ❌  
- Property Inspector Separation: 0% ❌
- Import/Export System: 0% ❌
- Modular Error Handling: 0% ❌

#### **Phase 2 (ShadCN Expansion)**: 30% 🔄 UPDATED
- Non-Text Components: 3/37 components (8%)
- Text Components: MIGRATING TO UNIFIED SYSTEM

#### **Phase 3 (Migration)**: 20% 🔄 UPDATED
- Registry Migration: 0% ❌
- Content Migration: 0% ❌
- Inspector Migration: 20% 🔄

#### **Phase 4 (Advanced Features)**: 0% ❌
- Validation System: 0% ❌
- Enhanced Features: 0% ❌

### Architecture Achievements

- ✅ **Modular Design** - Each widget is completely isolated
- ✅ **DRY Principle** - Reusable property inspectors
- ✅ **Type Safety** - Full TypeScript coverage with Zod validation
- ✅ **Composite Support** - Widgets can combine multiple property inspectors
- ✅ **Framework Integration** - Next.js optimized components in atoms
- ✅ **Design System** - ShadCN/UI components for consistent styling

### Updated Success Criteria

#### Technical Requirements
- [ ] **Zero Widget Overlap**: No duplicate functionality between atoms/shadcn
- [ ] **Unified Text System**: Single schema for all text content
- [ ] **Dual Rendering**: Semantic and ShadCN adapters working
- [ ] **Profile Switching**: Context-based render mode selection
- [ ] **Separated Inspectors**: Content/Semantics/Presentation tabs
- [ ] **Automatic Inheritance**: ShadCN components get semantic properties
- [ ] **Multi-Format I/O**: JSON, HTML, TypeScript import/export
- [ ] **Error Isolation**: Widget failures don't cascade
- [ ] **Validation Rules**: H1 limit, heading hierarchy, accessibility
- [ ] **Migration System**: Backward compatibility for existing content

#### User Experience
- [ ] **Clear Widget Selection**: No confusion about which widget to use
- [ ] **Consistent Behavior**: Same content, different presentations
- [ ] **Profile Awareness**: Users understand semantic vs styled modes
- [ ] **Smooth Migration**: Existing content works without manual updates
- [ ] **Error Recovery**: Graceful handling of widget failures

### Benefits of Unified Architecture

1. **No Overlap**: Single node type, dual renderers eliminate duplication
2. **Maximum Flexibility**: Semantic for SEO/a11y, ShadCN for rich UI
3. **DRY & Safe**: Single schema + migrator system
4. **Type Safety**: Full TypeScript coverage with Zod validation
5. **Future Proof**: Easy to extend with new render profiles
6. **Automatic Inheritance**: ShadCN components automatically get semantic properties
7. **Error Isolation**: Widget failures don't cascade to other widgets
8. **Multi-Format Support**: Import/export in JSON, HTML, and TypeScript

### Next Immediate Actions (UPDATED PRIORITY)

1. **CRITICAL**: Implement unified `TextNode` schema and validation system
2. **CRITICAL**: Build semantic and ShadCN text renderers with dual output
3. **CRITICAL**: Create separated property inspector system with automatic inheritance
4. **HIGH**: Implement multi-format import/export system (JSON, HTML, TypeScript)
5. **HIGH**: Add modular error handling with widget isolation
6. **MEDIUM**: Update widget registry to use unified architecture
7. **MEDIUM**: Create migration system for existing content

---

## Widget Architecture Comparison

### Before: Overlapping Widgets
```
atoms/heading     → <h1>, <h2>, <h3>...
shadcn/typography → TypographyH1, TypographyH2, TypographyH3...
```
**Problems**: Duplication, confusion, maintenance overhead

### After: Unified Architecture
```
text (role: heading, level: 1) → SemanticText → <h1>
text (role: heading, level: 1) → ShadcnText   → <h1 className="...">
```
**Benefits**: Single source of truth, dual rendering, no overlap, automatic property inheritance

---

**CRITICAL UPDATE SUMMARY**: The unified widget architecture with semantic-presentation separation, automatic property inheritance, multi-format import/export, and modular error handling is now the top priority. This addresses the root cause of widget overlap while providing a robust, future-proof foundation for the entire CMS system.

---

**Last Updated:** Current Date  
**Status:** Documentation Consolidated, Ready for Implementation  
**Next Review:** After Unified Architecture Implementation
