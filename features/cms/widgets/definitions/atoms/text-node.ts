import { z } from "zod"

// Unified TextNode Schema for the new architecture
export const TextNodeSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  role: z.enum(['heading', 'paragraph', 'blockquote', 'list', 'table', 'inlineCode']),
  level: z.number().min(1).max(6).optional(),
  listType: z.enum(['ul', 'ol']).optional(),
  rows: z.array(z.array(z.string())).optional(),
  headerRows: z.number().optional(),
  caption: z.string().optional(),
  datetime: z.string().optional(),
  content: z.string().optional(),
  items: z.array(z.string()).optional(),
  tone: z.enum(['default', 'muted', 'lead', 'large', 'small']).optional(),
}).refine((data) => {
  // Validation rules
  if (data.role === 'heading' && data.level === undefined) {
    return false // Heading must have level
  }
  if (data.role === 'list' && data.listType === undefined) {
    return false // List must have listType
  }
  if (data.role === 'list' && !data.items?.length) {
    return false // List must have items
  }
  if (data.role === 'table' && !data.rows?.length) {
    return false // Table must have rows
  }
  return true
}, {
  message: "Invalid text node configuration"
})

export type TextNode = z.infer<typeof TextNodeSchema>

// Widget definition following the new unified architecture
export const textWidgetDefinition = {
  type: 'text' as const,
  name: 'Text',
  description: 'Unified text widget that renders as semantic HTML or styled components',
  category: 'atom' as const,
  icon: 'Type',
  
  // Default props for new widgets
  defaultProps: {
    role: 'paragraph',
    content: 'Enter your text here...',
    tone: 'default'
  } as Partial<TextNode>,
  
  // Schema for validation
  schema: TextNodeSchema,
  
  // Property inspector configuration
  propertyGroups: {
    content: {
      title: 'Content',
      description: 'Text content and structure',
      alwaysVisible: true,
      properties: ['content', 'items', 'rows', 'caption']
    },
    semantics: {
      title: 'Semantics',
      description: 'HTML semantic properties',
      visibleInProfile: ['semantic'],
      properties: ['role', 'level', 'listType', 'datetime', 'headerRows']
    },
    presentation: {
      title: 'Presentation',
      description: 'Visual styling options',
      visibleInProfile: ['shadcn'],
      properties: ['tone']
    }
  }
}

export default textWidgetDefinition
