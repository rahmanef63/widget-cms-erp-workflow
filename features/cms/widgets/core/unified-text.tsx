import React from 'react'
import { useRenderProfile } from './render-context'
import { SemanticText } from '../renderers/atoms/semantic-text'
import { ShadcnText } from '../renderers/shadcn/shadcn-text'
import type { TextNode } from '../definitions/atoms/text-node'

export interface UnifiedTextProps {
  node: TextNode
  className?: string
}

/**
 * Unified text component that renders based on current profile
 * - semantic profile: outputs semantic HTML for SEO/accessibility
 * - shadcn profile: outputs styled components for rich UI
 */
export function UnifiedText({ node, className }: UnifiedTextProps) {
  const profile = useRenderProfile()
  
  return profile === 'semantic' 
    ? <SemanticText node={node} />
    : <ShadcnText node={node} className={className} />
}

export default UnifiedText
