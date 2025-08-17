"use client"
import type { ReactNode } from "react"

interface CMSLayoutProps {
  toolbar: ReactNode
  sidebar: ReactNode
  inspector: ReactNode
  preview: ReactNode
  children: ReactNode
}

export function CMSLayout({ toolbar, sidebar, inspector, preview, children }: CMSLayoutProps) {
  return (
    <div className="h-dvh w-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background">{toolbar}</div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="border-r bg-background">{sidebar}</div>

        {/* Canvas area */}
        <div className="flex-1 relative">{children}</div>

        {/* Inspector */}
        <div className="border-l bg-background">{inspector}</div>
      </div>
    </div>
  )
}
