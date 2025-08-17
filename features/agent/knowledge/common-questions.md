# Common Questions

## CMS Builder Questions

### How do I display results in Preview?
Ensure at least one root node is connected to the node with id 'preview' (edge: source=<root>, target='preview').

### How is child order determined within a parent?
Determined by the ascending position.x value of children (leftmost renders first).

### When should I use row vs column?
- **row**: For horizontal arrangement of elements
- **column**: For vertical stacking of elements
- Combine as needed for complex layouts

### How do I apply custom styling?
Use `props.className` for Tailwind/CSS classes and `props.styleJson` for JSON string styles (e.g., `{"border":"1px solid #eee"}`).

### What are the available button sizes?
- **sm**: Small button
- **md**: Medium button (default)
- **lg**: Large button

### What's the difference between 'type' and 'rfType' in schema?
- **rfType**: ReactFlow node type (e.g., 'component')
- **data.type**: CMS component type (section, text, etc.)

## AI Agent Questions

### Which AI models are supported?
- Anthropic Claude
- OpenAI GPT models
- Google Gemini
- Groq
- DeepInfra
- XAI Grok

### What happens if a model is unavailable?
The system automatically falls back to available models with graceful error handling.

### How do I customize agent behavior?
Configure model settings, adjust system prompts, and set specific instructions for your use case.

### Can I use multiple models simultaneously?
Yes, the system supports model switching and comparison for different tasks.

## Development Questions

### How do I add new component types?
1. Define component schema in widget definitions
2. Create renderer component
3. Add to component registry
4. Update type definitions

### How do I implement custom validation?
Use Zod schemas in the validation system with custom refinement rules.

### How do I handle errors gracefully?
Implement error boundaries, fallback components, and user-friendly error messages.

### How do I optimize performance?
- Use lazy loading for components
- Implement proper memoization
- Optimize bundle size
- Use efficient state management

## Troubleshooting

### Schema generation fails
- Check that all required props are provided
- Verify edge relationships are valid
- Ensure node IDs are unique
- Connect at least one root to 'preview'

### Components not rendering
- Verify component type is registered
- Check props validation
- Ensure proper parent-child relationships
- Review console for errors

### AI responses are inconsistent
- Provide more specific prompts
- Check model configuration
- Verify knowledge base is current
- Consider using different models for comparison

### Performance issues
- Review component complexity
- Check for unnecessary re-renders
- Optimize large datasets
- Consider pagination or virtualization
