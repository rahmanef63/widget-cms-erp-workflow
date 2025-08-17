import React, { useState } from 'react'
import { RenderProvider, useRenderProfileControls } from '../core/render-context'
import { UnifiedText } from '../core/unified-text'
import { TextPropertyInspector } from '../inspector/text-property-inspector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TextNode } from '../definitions/atoms/text-node'

// Sample text nodes demonstrating different roles
const sampleNodes: TextNode[] = [
  {
    id: '1',
    type: 'text',
    role: 'heading',
    level: 1,
    content: 'Welcome to Our Site',
    tone: 'default'
  },
  {
    id: '2', 
    type: 'text',
    role: 'paragraph',
    content: 'This is a paragraph that demonstrates the unified text architecture.',
    tone: 'lead'
  },
  {
    id: '3',
    type: 'text',
    role: 'list',
    listType: 'ul',
    items: ['First item', 'Second item', 'Third item']
  },
  {
    id: '4',
    type: 'text',
    role: 'blockquote',
    content: 'This is a blockquote that shows how content renders differently based on profile.'
  }
]

function ProfileSwitcher() {
  const { profile, setProfile } = useRenderProfileControls()
  
  return (
    <div className="flex gap-2 mb-4">
      <Button 
        variant={profile === 'semantic' ? 'default' : 'outline'}
        onClick={() => setProfile('semantic')}
      >
        Semantic HTML
      </Button>
      <Button 
        variant={profile === 'shadcn' ? 'default' : 'outline'}
        onClick={() => setProfile('shadcn')}
      >
        ShadCN Styled
      </Button>
    </div>
  )
}

function TextNodeDemo({ node, onUpdate }: { 
  node: TextNode
  onUpdate: (updates: Partial<TextNode>) => void 
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Text Node: {node.role}</CardTitle>
        <CardDescription>
          Profile-based rendering demonstration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Rendered Output:</h4>
            <div className="border rounded p-4 min-h-[100px]">
              <UnifiedText node={node} />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Property Inspector:</h4>
            <div className="border rounded p-4 max-h-[300px] overflow-y-auto">
              <TextPropertyInspector 
                node={node} 
                onChange={onUpdate}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Demo component showing the unified widget architecture in action
 * - Profile switching between semantic and ShadCN
 * - Different text node roles
 * - Property inspector adaptation based on profile
 */
export function UnifiedTextDemo() {
  const [nodes, setNodes] = useState<TextNode[]>(sampleNodes)
  
  const updateNode = (index: number, updates: Partial<TextNode>) => {
    setNodes(prev => prev.map((node, i) => 
      i === index ? { ...node, ...updates } : node
    ))
  }
  
  return (
    <RenderProvider profile="semantic">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Unified Widget Architecture Demo</h1>
          <p className="text-muted-foreground mb-4">
            This demo shows how the same TextNode data renders differently based on the render profile.
            Switch between profiles and modify properties to see the unified architecture in action.
          </p>
          
          <ProfileSwitcher />
        </div>
        
        <div className="space-y-4">
          {nodes.map((node, index) => (
            <TextNodeDemo
              key={node.id}
              node={node}
              onUpdate={(updates) => updateNode(index, updates)}
            />
          ))}
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Architecture Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>No Widget Overlap:</strong> Single TextNode schema eliminates duplicate widgets</li>
              <li><strong>Profile-Based Rendering:</strong> Semantic HTML for SEO, ShadCN for rich UI</li>
              <li><strong>Dynamic Property Inspector:</strong> Tabs appear/disappear based on current profile</li>
              <li><strong>Type Safety:</strong> Full TypeScript support with Zod validation</li>
              <li><strong>Future Proof:</strong> Easy to add new render profiles and properties</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </RenderProvider>
  )
}

export default UnifiedTextDemo
