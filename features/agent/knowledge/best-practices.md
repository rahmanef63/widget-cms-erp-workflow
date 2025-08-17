# Agent Best Practices

## CMS Schema Generation
- Always ensure at least one root connects to 'preview' node
- Use minimal, sensible defaults to avoid complexity
- Prefer semantic grouping (column for vertical, row for horizontal)
- Implement proper component hierarchy
- Validate edge relationships before generation

## Layout Patterns
### Hero Section
- Structure: section(center) > column(center) > text(h1) + text(p) + button
- Use appropriate heading hierarchy (h1 for main title)
- Include compelling call-to-action

### Feature Grid
- Structure: section > column > row > (card × 3)
- Maintain consistent card sizing
- Use descriptive titles and benefits-focused copy

### Pricing Section
- Structure: section > row(center) > (card × 3)
- Include title, description, price, and features
- Highlight recommended option

### Testimonial Section
- Structure: section > column > card > text + avatar + text
- Include customer photo, quote, and attribution
- Use social proof effectively

## Component Usage Guidelines
### Text Components
- h1: Main page title (use once per page)
- h2-h6: Section headings (maintain hierarchy)
- p: Body text and descriptions
- Use appropriate font weights and sizes

### Layout Components
- section: Page-level containers with background/padding
- row: Horizontal grouping with gap control
- column: Vertical stacking with alignment
- Consistent spacing and alignment

### Interactive Components
- button: Clear, action-oriented labels
- Appropriate sizing (sm/md/lg)
- Consider accessibility and contrast

## Content Guidelines
- Write clear, benefit-focused copy
- Use active voice and action verbs
- Maintain consistent tone and style
- Include relevant keywords naturally
- Optimize for readability and scanning

## Technical Considerations
- Ensure responsive design compatibility
- Use semantic HTML structure
- Implement proper ARIA labels
- Optimize for performance
- Validate all component props
- Handle error states gracefully

## User Experience
- Progressive disclosure of complex features
- Clear visual hierarchy
- Consistent interaction patterns
- Helpful error messages and guidance
- Fast response times and feedback

## Interview Process
- Ask clarifying questions systematically
- Gather complete requirements before generation
- Validate understanding with user
- Provide options when appropriate
- Explain decisions and recommendations
