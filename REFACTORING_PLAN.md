# CMS Widget System Refactoring Plan

## Overview
This document outlines the systematic refactoring plan to align the current CMS implementation with the comprehensive documentation structure. The plan ensures no breaking changes to the web application while modernizing the architecture.

## Critical Issues Analysis

### 11 Critical Issues Identified

Based on the comprehensive analysis in `docs/01-architecture/widget-system-issues-analysis.md`, the following critical issues need resolution:

#### NEW #1: Widget Overlap Problem (CRITICAL)
**Problem**: Duplicate widgets for same content (`atoms/heading` vs `shadcn/typography`)
**Impact**: Developer confusion, maintenance overhead, inconsistent behavior
**Solution**: Single `TextNode` schema with dual renderers

#### High Priority Issues
1. **Deep Nested Object Hell** - 5-7 levels deep nested object structures in complex widgets
2. **Magic String Property Paths** - No compile-time safety for property access
3. **No Widget Validation System** - Runtime crashes from invalid states
4. **Weak TypeScript Typing** - Widget definitions use `any` types
5. **No Widget Versioning** - No system for handling schema changes

#### Medium Priority Issues
6. **Hardcoded Tailwind Classes** - No design system consistency
7. **Inconsistent Widget Structure** - Mixed PropertyPanel usage
8. **Massive Code Duplication** - Similar widgets repeat patterns
9. **Tightly Coupled Property Schemas** - Poor separation of concerns
10. **No Composition Patterns** - Monolithic widget definitions

## Current Status Analysis

### ✅ Completed Tasks
- [x] Moved `features/cms/core/` to `features/cms/widgets/core/`
- [x] Updated all import references to new core location
- [x] Created missing PropertyPanel files (Button, Input, Heading)
- [x] Consolidated documentation into single comprehensive file
- [x] **Phase 1 Infrastructure Complete** - Core widget system architecture implemented
- [x] **Modular Property Inspector System** - Base architecture and registry created
- [x] **ShadCN Widgets Foundation** - Typography, Accordion, Button widgets implemented
- [x] **Atoms Widgets Complete** - Semantic HTML + Next.js optimized components

### 🔄 Structure Alignment Issues

#### 1. Missing Widget Category Directories
**Current:** Only `atoms/`, `core/`, `shared/`, `collections/` exist
**Required:** Need `molecules/`, `organisms/`, `templates/` directories

#### 2. Incomplete ShadCN Integration
**Current:** 3/40+ ShadCN components implemented (Typography, Accordion, Button)
**Required:** Full ShadCN component library integration

#### 3. Legacy Property Panel System
**Current:** Mixed PropertyPanel and modular inspector usage
**Required:** Complete migration to modular inspector system

## Implementation Patterns

### Widget Builder Pattern

The foundation includes a Widget Builder Pattern for type-safe widget creation:

\`\`\`typescript
// Example usage from implemented system
const button = new WidgetBuilder('button')
  .addProp('text', 'Click me')
  .addProp('variant', 'primary')
  .addClass('btn-primary')
  .validate() // Zod validation
  .build()
\`\`\`

### Unified Widget Architecture (NEW CRITICAL PRIORITY)

Based on the comprehensive analysis, the #1 critical issue is widget overlap. The solution is a unified architecture that separates semantic meaning from visual presentation.

#### Core Principle: Anti-Overlap Rule

**Problem**: Duplicate widgets (`atoms/heading` vs `shadcn/typography`) cause confusion and maintenance overhead.

**Solution**: Single `TextNode` schema with dual renderers:
- **Semantic Adapter**: HTML tags for SEO/accessibility
- **ShadCN Adapter**: Styled components for rich UI

#### Unified TextNode Schema

\`\`\`typescript
export interface TextNode {
  id: string;
  type: 'text';
  role: 'heading'|'paragraph'|'blockquote'|'list'|'table'|'inlineCode';
  level?: 1|2|3|4|5|6;           // only role=heading
  listType?: 'ul'|'ol';          // only role=list
  rows?: string[][];             // only role=table
  headerRows?: number;           // table thead split
  caption?: string;              // table/figure caption
  datetime?: string;             // <time> support (ISO)
  content?: string;              // p/blockquote/inlineCode/heading
  items?: string[];              // list content
  tone?: 'default'|'muted'|'lead'|'large'|'small';  // presentational hint
}
\`\`\`

#### Dual Renderer System

\`\`\`typescript
export type RenderProfile = 'semantic' | 'shadcn';

// Unified Text component with profile-based rendering
export function Text({ node }: { node: TextNode }) {
  const profile = useRenderProfile();
  return profile === 'semantic'
    ? <SemanticText node={node}/>
    : <ShadcnText node={node}/>;
}
\`\`\`

#### Property Inspector Separation

**Three Property Categories:**
1. **Content** (always available): `content`, `items`, `rows`, `caption`
2. **Semantics** (semantic profile only): `role`, `level`, `listType`, `datetime`
3. **Presentation** (shadcn profile only): `tone`, styling options

#### Import/Export Strategy (DRY & Dynamic)

**Multi-Format Import:**
\`\`\`typescript
// Import by widget ID (JSON reference)
const widget = importFromJson({ widgetId: "text-123" });

// Import from HTML directly
const widget = importFromHtml('<h1>My Title</h1>');
// Results in: { type: 'text', role: 'heading', level: 1, content: 'My Title' }
\`\`\`

**Multi-Format Export:**
\`\`\`typescript
// Export to semantic HTML
const semanticHtml = exportToHtml(textNode, 'semantic');
// Output: <h1>My Title</h1>

// Export to styled HTML
const styledHtml = exportToHtml(textNode, 'shadcn');
// Output: <h1 class="scroll-m-20 text-4xl...">My Title</h1>

// Export to JSON and TypeScript
const json = exportToJson(textNode);
const ts = exportToTypeScript(textNode);
\`\`\`

#### Automatic Property Inspector Inheritance

**ShadCN components automatically inherit properties from their semantic HTML base:**
\`\`\`typescript
// Button inherits semantic button properties + adds presentation properties
const buttonProperties = {
  semantic: ['type', 'disabled', 'form', 'name'],  // HTML button attributes
  presentation: ['variant', 'size', 'tone'],       // ShadCN styling
  content: ['text', 'icon']                        // Content properties
};
\`\`\`

#### Modular Error Handling

**Widget Isolation Strategy:**
\`\`\`typescript
// Each widget is independent - errors don't cascade
try {
  renderWidget(widget);
} catch (error) {
  isolateWidget(widget.id, error);
  renderFallback(widget.id); // Fallback content
}
\`\`\`

## Validation System

Zod-based validation system implemented in `features/cms/core/validation/`:

\`\`\`typescript
const ButtonWidgetSchema = BaseWidgetSchema.extend({
  type: z.literal('button'),
  props: z.object({
    text: z.string().min(1),
    variant: z.enum(['primary', 'secondary', 'outline']),
    size: z.enum(['sm', 'md', 'lg']).default('md')
  })
})
\`\`\`

## Refactoring Strategy

### Phase 1: Unified Architecture Foundation (NEW CRITICAL PRIORITY)
**Status**: 🔄 IN PROGRESS | **Priority**: CRITICAL | **Risk**: Medium

#### 1.1 Core Schema Implementation
- [ ] Create unified `TextNode` interface with role-based properties
- [ ] Implement Zod validation with semantic rules (H1 limit, heading hierarchy)
- [ ] Add render profile context system (`semantic` vs `shadcn`)

#### 1.2 Dual Renderer System
- [ ] Build `SemanticText` adapter (HTML tags + accessibility)
- [ ] Build `ShadcnText` adapter (styled components + design system)
- [ ] Create unified `Text` component with profile switching

#### 1.3 Property Inspector Separation
- [ ] **Content Tab**: Always available (content, items, rows, caption)
- [ ] **Semantics Tab**: Only active in semantic profile (role, level, listType)
- [ ] **Presentation Tab**: Only active in shadcn profile (tone, styling)

#### 1.4 Import/Export System
- [ ] Implement JSON import by widget ID reference
- [ ] Implement direct HTML import with DOM parsing
- [ ] Create multi-format export (HTML semantic, HTML styled, JSON, TypeScript)
- [ ] Add automatic property inspector inheritance system

#### 1.5 Modular Error Handling
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

**NOTE**: All text-related components now handled by unified `TextNode` system with automatic property inheritance.

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

#### 3.3 Property Inspector Migration
- [ ] Replace legacy PropertyPanel components with modular inspectors
- [ ] Implement profile-based tab activation
- [ ] Add validation and error handling

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

## Updated Architecture Benefits

### 1. No Widget Overlap
- **Before**: `atoms/heading` + `shadcn/typography` = confusion
- **After**: Single `text` widget with dual rendering = clarity

### 2. Maximum Flexibility
- **Semantic Profile**: Perfect HTML for SEO, accessibility, blog content
- **ShadCN Profile**: Rich styled components for marketing, UI pages

### 3. Single Source of Truth
- One schema, one validation system, one migration path
- Eliminates maintenance overhead of duplicate widgets

### 4. Automatic Property Inheritance
- ShadCN components automatically get semantic HTML properties
- Dynamic property inspector generation based on underlying HTML
- DRY principle applied to property definitions

### 5. Multi-Format Import/Export
- Import widgets via JSON ID reference or direct HTML
- Export to semantic HTML, styled HTML, JSON, and TypeScript
- Modular system supports adding new formats

### 6. Error Isolation & Recovery
- Widget failures don't cascade to other widgets
- Automatic fallback rendering for broken widgets
- Graceful degradation maintains user experience

### 7. Future-Proof Architecture
- Easy to add new render profiles (e.g., `email`, `print`)
- Extensible property system without breaking changes
- Modular design supports independent widget development

## Implementation Example

### Before (Overlapping Widgets)
\`\`\`typescript
// Confusing: Two widgets for same content
const heading1 = { type: 'atoms/heading', level: 1, content: 'Title' }
const heading2 = { type: 'shadcn/typography', variant: 'h1', content: 'Title' }
\`\`\`

### After (Unified Architecture)
\`\`\`typescript
const heading = { 
  type: 'text', 
  role: 'heading', 
  level: 1, 
  content: 'Title',
  tone: 'default'
}

// Renders as <h1>Title</h1> in semantic profile
// Renders as <h1 className="scroll-m-20 text-4xl...">Title</h1> in shadcn profile
// Automatically inherits semantic HTML properties + adds presentation properties
\`\`\`

## Updated Progress Tracking

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

## Updated Success Criteria

### Technical Requirements
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

### User Experience
- [ ] **Clear Widget Selection**: No confusion about which widget to use
- [ ] **Consistent Behavior**: Same content, different presentations
- [ ] **Profile Awareness**: Users understand semantic vs styled modes
- [ ] **Smooth Migration**: Existing content works without manual updates
- [ ] **Error Recovery**: Graceful handling of widget failures

## Next Immediate Actions (UPDATED PRIORITY)

1. **CRITICAL**: Implement unified `TextNode` schema and validation system
2. **CRITICAL**: Build semantic and ShadCN text renderers with dual output
3. **CRITICAL**: Create separated property inspector system with automatic inheritance
4. **HIGH**: Implement multi-format import/export system (JSON, HTML, TypeScript)
5. **HIGH**: Add modular error handling with widget isolation
6. **MEDIUM**: Update widget registry to use unified architecture
7. **MEDIUM**: Create migration system for existing content

## Risk Assessment

### High Risk (Requires Careful Planning)
- Widget registry migration (affects all existing content)
- Property inspector system changes (UI breaking changes)
- Content migration (data transformation required)

### Medium Risk (Manageable with Testing)
- Dual renderer implementation (new code, isolated)
- Validation system updates (additive changes)

### Low Risk (Safe to Implement)
- New unified schema definition (additive)
- Render profile context (new feature)
- Documentation updates (no code impact)

---

**CRITICAL UPDATE SUMMARY**: The unified widget architecture with semantic-presentation separation, automatic property inheritance, multi-format import/export, and modular error handling is now the top priority. This addresses the root cause of widget overlap while providing a robust, future-proof foundation for the entire CMS system.

## Detailed Folder Structure

### File Naming Conventions

#### Widget Files
- `index.ts` - Main widget export
- `config.ts` - Widget configuration
- `schema.ts` - Validation schema
- `PropertyPanel.tsx` - Custom property editor (if needed)
- `types.ts` - Widget-specific types

#### Utility Files
- `utils.ts` - Widget-specific utilities
- `constants.ts` - Widget constants
- `hooks.ts` - Widget-specific React hooks

### Import Path Examples
\`\`\`typescript
// Core system
import { WidgetBuilder } from '@/features/cms/widgets/core/builders'
import { WidgetValidator } from '@/features/cms/widgets/core/validation'

// Atomic widgets
import { DivWidget } from '@/features/cms/widgets/atoms/div'

// ShadCN widgets
import { ButtonWidget } from '@/features/cms/widgets/shadcn/button'

// Shared utilities
import { WidgetTypes } from '@/features/cms/widgets/shared/types'
\`\`\`

## Implementation Plan

### Week 1: Foundation (Phase 1) ✅ COMPLETE
- [x] Create missing directory structure
- [x] Add index files and basic organization
- [x] Update widget registry to support new categories
- [x] Test existing functionality remains intact

### Week 2: ShadCN Expansion (Phase 2) 🔄 IN PROGRESS
- [ ] Implement Form & Input components (8 components)
- [ ] Implement Layout & Navigation components (8 components)
- [ ] Create property panels for new components
- [ ] Add to widget registry and categories
- [ ] Test component rendering and properties

### Week 3: Inspector Modernization (Phase 3)
- [ ] Audit remaining PropertyPanel usage
- [ ] Create modular inspector components for all widgets
- [ ] Update widget definitions to use new system
- [ ] Maintain backward compatibility

### Week 4: Testing & Validation (All Phases)
- [ ] Comprehensive testing of all widgets
- [ ] Verify no breaking changes to existing functionality
- [ ] Performance testing and optimization
- [ ] Documentation updates

## Notes

- All changes maintain backward compatibility
- Existing widgets continue to function unchanged
- New structure supports future expansion
- Documentation alignment ensures consistency
- Gradual migration reduces risk of breaking changes
- Phase 1 infrastructure provides solid foundation for remaining phases

---

**Last Updated:** Current Date
**Status:** Phase 1 Complete, Phase 2 In Progress (75% overall completion)
**Next Review:** After ShadCN Component Expansion
