import React from 'react'
import type { TextNode } from '../../definitions/atoms/text-node'

export interface SemanticTextProps {
  node: TextNode
}

/**
 * Semantic text renderer - outputs proper HTML tags for SEO and accessibility
 */
export function SemanticText({ node }: SemanticTextProps) {
  switch (node.role) {
    case 'heading': {
      const level = node.level ?? 2
      const Tag = `h${level}` as keyof JSX.IntrinsicElements
      return <Tag>{node.content}</Tag>
    }
    
    case 'paragraph':
      return <p>{node.content}</p>
    
    case 'blockquote':
      return (
        <blockquote>
          <p>{node.content}</p>
        </blockquote>
      )
    
    case 'inlineCode':
      return <code>{node.content}</code>
    
    case 'list': {
      const ListTag = node.listType === 'ol' ? 'ol' : 'ul'
      return (
        <ListTag>
          {node.items?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      )
    }
    
    case 'table': {
      const rows = node.rows ?? []
      const headerRows = node.headerRows ?? 1
      
      return (
        <figure>
          <table>
            {node.caption && <caption>{node.caption}</caption>}
            {headerRows > 0 && (
              <thead>
                {rows.slice(0, headerRows).map((row, rowIndex) => (
                  <tr key={`header-${rowIndex}`}>
                    {row.map((cell, cellIndex) => (
                      <th key={cellIndex} scope="col">
                        {cell}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            )}
            <tbody>
              {rows.slice(headerRows).map((row, rowIndex) => (
                <tr key={`body-${rowIndex}`}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )
    }
    
    default:
      return <span>{node.content}</span>
  }
}

export default SemanticText
