import React from 'react'
import { cn } from '@/shared/lib/utils'
import type { TextNode } from '../../definitions/atoms/text-node'

export interface ShadcnTextProps {
  node: TextNode
  className?: string
}

/**
 * ShadCN text renderer - outputs styled components with design system classes
 */
export function ShadcnText({ node, className }: ShadcnTextProps) {
  const tone = node.tone ?? 'default'

  if (node.role === 'heading') {
    const level = node.level ?? 2
    const headingClasses = {
      1: "scroll-m-20 text-4xl font-extrabold tracking-tight text-balance lg:text-5xl",
      2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      4: "scroll-m-20 text-xl font-semibold tracking-tight",
      5: "text-lg font-semibold",
      6: "text-base font-semibold",
    }[level as keyof typeof headingClasses]
    
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    return (
      <Tag className={cn(headingClasses, className)}>
        {node.content}
      </Tag>
    )
  }

  if (node.role === 'paragraph') {
    const paragraphClasses = {
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      default: "leading-7 [&:not(:first-child)]:mt-6",
    }[tone]
    
    const Component = tone === 'small' ? 'small' : 'p'
    return (
      <Component className={cn(paragraphClasses, className)}>
        {node.content}
      </Component>
    )
  }

  if (node.role === 'blockquote') {
    return (
      <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>
        {node.content}
      </blockquote>
    )
  }

  if (node.role === 'inlineCode') {
    return (
      <code className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}>
        {node.content}
      </code>
    )
  }

  if (node.role === 'list') {
    const listClasses = "my-6 ml-6 list-disc [&>li]:mt-2"
    const ListTag = node.listType === 'ol' ? 'ol' : 'ul'
    
    return (
      <ListTag className={cn(listClasses, className)}>
        {node.items?.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ListTag>
    )
  }

  if (node.role === 'table') {
    const rows = node.rows ?? []
    const headerRows = node.headerRows ?? 1
    
    return (
      <div className={cn("relative w-full overflow-auto", className)}>
        <table className="w-full caption-bottom text-sm">
          {node.caption && (
            <caption className="mt-4 text-sm text-muted-foreground">
              {node.caption}
            </caption>
          )}
          {headerRows > 0 && (
            <thead className="[&_tr]:border-b">
              {rows.slice(0, headerRows).map((row, rowIndex) => (
                <tr key={`header-${rowIndex}`} className="border-b transition-colors hover:bg-muted/50">
                  {row.map((cell, cellIndex) => (
                    <th 
                      key={cellIndex} 
                      className="h-10 px-2 text-left align-middle font-medium text-muted-foreground"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}
          <tbody className="[&_tr:last-child]:border-0">
            {rows.slice(headerRows).map((row, rowIndex) => (
              <tr key={`body-${rowIndex}`} className="border-b transition-colors hover:bg-muted/50">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-2 align-middle">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Fallback
  return <span className={className}>{node.content}</span>
}

export default ShadcnText
