import React from 'react'
import { useRenderProfile } from '../core/render-context'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { TextNode } from '../definitions/atoms/text-node'

interface TextPropertyInspectorProps {
  node: TextNode
  onChange: (updates: Partial<TextNode>) => void
}

/**
 * Property inspector for text widgets with profile-based tab visibility
 */
export function TextPropertyInspector({ node, onChange }: TextPropertyInspectorProps) {
  const profile = useRenderProfile()

  const handleChange = (field: keyof TextNode, value: any) => {
    onChange({ [field]: value })
  }

  const handleListItemChange = (index: number, value: string) => {
    const newItems = [...(node.items || [])]
    newItems[index] = value
    onChange({ items: newItems })
  }

  const addListItem = () => {
    const newItems = [...(node.items || []), '']
    onChange({ items: newItems })
  }

  const removeListItem = (index: number) => {
    const newItems = (node.items || []).filter((_, i) => i !== index)
    onChange({ items: newItems })
  }

  const getVisibleTabs = () => {
    const tabs = ['content']
    if (profile === 'semantic') tabs.push('semantics')
    if (profile === 'shadcn') tabs.push('presentation')
    return tabs
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          {profile === 'semantic' && (
            <TabsTrigger value="semantics">Semantics</TabsTrigger>
          )}
          {profile === 'shadcn' && (
            <TabsTrigger value="presentation">Presentation</TabsTrigger>
          )}
        </TabsList>

        {/* Content Tab - Always Available */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Text content and structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {node.role === 'paragraph' || node.role === 'heading' || node.role === 'blockquote' || node.role === 'inlineCode' ? (
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={node.content || ''}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Enter your text..."
                  />
                </div>
              ) : null}

              {node.role === 'list' && (
                <div>
                  <Label>List Items</Label>
                  <div className="space-y-2">
                    {(node.items || []).map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => handleListItemChange(index, e.target.value)}
                          placeholder={`Item ${index + 1}`}
                        />
                        <button 
                          onClick={() => removeListItem(index)}
                          className="px-2 py-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={addListItem}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              )}

              {node.role === 'table' && node.caption !== undefined && (
                <div>
                  <Label htmlFor="caption">Table Caption</Label>
                  <Input
                    id="caption"
                    value={node.caption || ''}
                    onChange={(e) => handleChange('caption', e.target.value)}
                    placeholder="Table description..."
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Semantics Tab - Only for semantic profile */}
        {profile === 'semantic' && (
          <TabsContent value="semantics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Semantics</CardTitle>
                <CardDescription>HTML semantic properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={node.role} onValueChange={(value) => handleChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heading">Heading</SelectItem>
                      <SelectItem value="paragraph">Paragraph</SelectItem>
                      <SelectItem value="blockquote">Blockquote</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="table">Table</SelectItem>
                      <SelectItem value="inlineCode">Inline Code</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {node.role === 'heading' && (
                  <div>
                    <Label htmlFor="level">Heading Level</Label>
                    <Select value={String(node.level || 2)} onValueChange={(value) => handleChange('level', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">H1</SelectItem>
                        <SelectItem value="2">H2</SelectItem>
                        <SelectItem value="3">H3</SelectItem>
                        <SelectItem value="4">H4</SelectItem>
                        <SelectItem value="5">H5</SelectItem>
                        <SelectItem value="6">H6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {node.role === 'list' && (
                  <div>
                    <Label htmlFor="listType">List Type</Label>
                    <Select value={node.listType || 'ul'} onValueChange={(value) => handleChange('listType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select list type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ul">Unordered List</SelectItem>
                        <SelectItem value="ol">Ordered List</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {node.role === 'table' && (
                  <div>
                    <Label htmlFor="headerRows">Header Rows</Label>
                    <Input
                      id="headerRows"
                      type="number"
                      min="0"
                      value={node.headerRows || 1}
                      onChange={(e) => handleChange('headerRows', parseInt(e.target.value))}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Presentation Tab - Only for shadcn profile */}
        {profile === 'shadcn' && (
          <TabsContent value="presentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Presentation</CardTitle>
                <CardDescription>Visual styling options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={node.tone || 'default'} onValueChange={(value) => handleChange('tone', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="muted">Muted</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default TextPropertyInspector
