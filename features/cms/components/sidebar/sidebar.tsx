"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WIDGET_CATEGORIES } from "@/features/cms/widgets/core/widget-categories"
import type { WidgetCategory } from "@/features/cms/widgets/core/widget-categories"
import type { ComponentType } from "@/shared/types/schema"

export function Sidebar({
  open,
  pinned,
  hasSelection,
  onTogglePin,
  onClose,
  onAddComponent,
  onOpenChat,
  onGenerateTwoWays,
  onCreateJsonFromSelection,
  onOpenImport,
  onLoadExample,
  onExportSchema,
  onExportSingleFile,
  onExportEachRootAsFile,
  onExportStandaloneHTML,
  onRefreshPreview,
  onShareLink,
  onOpenWidgetDialog,
}: {
  open: boolean
  pinned: boolean
  hasSelection: boolean
  onTogglePin: () => void
  onClose: () => void
  onAddComponent: (type: string) => void
  onOpenChat: () => void
  onGenerateTwoWays: () => void
  onCreateJsonFromSelection: () => void
  onOpenImport: () => void
  onLoadExample: () => void
  onExportSchema: () => void
  onExportSingleFile: () => void
  onExportEachRootAsFile: () => void
  onExportStandaloneHTML: () => void
  onRefreshPreview: () => void
  onShareLink: () => void
  onOpenWidgetDialog: () => void
}) {
  // Create categories with proper structure for rendering
  const WIDGET_REGISTRY = WIDGET_CATEGORIES.map((category: WidgetCategory) => ({
    id: category.id,
    label: category.name,
    description: category.description,
    widgets: category.widgets.map((type: ComponentType) => ({
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' '),
      description: `${type} component`
    }))
  }))

  return (
    <aside
      className={[
        "border-r bg-white p-3 overflow-auto transition-all duration-300",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-700">Components</div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={onTogglePin}>
            {pinned ? "Unpin" : "Pin"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => (!pinned ? onClose() : null)}>
            Close
          </Button>
        </div>
      </div>

      <Tabs defaultValue="new" className="mt-2">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="new">Widgets</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-2">
          <Tabs defaultValue="atoms" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-3">
              {WIDGET_REGISTRY.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {WIDGET_REGISTRY.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                  <div className="text-xs font-medium text-gray-700">{category.label}</div>
                  <div className="text-[10px] text-gray-500">{category.description}</div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {category.widgets.map((widget: { type: string; label: string; description: string }) => (
                    <button
                      key={widget.type}
                      onClick={() => onAddComponent(widget.type)}
                      className="rounded-xl border px-3 py-2 text-xs hover:bg-blue-50 text-left border-blue-200 transition-colors"
                    >
                      <div className="mb-1 inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {widget.label}
                      </div>
                      <div className="text-[10px] text-blue-600">{widget.description}</div>
                    </button>
                  ))}

                  {category.widgets.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-4">
                      {category.label} widgets coming soon...
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>

      <div className="mt-4 text-xs font-semibold text-gray-700 mb-2">Actions & Share</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-transparent">
            Actions & Share<span className="sr-only">Open actions menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Export & Share</DropdownMenuLabel>
          <DropdownMenuItem onClick={onExportSchema}>Export Full Schema (JSON)</DropdownMenuItem>
          <DropdownMenuItem onClick={onExportSingleFile}>Export as React Component</DropdownMenuItem>
          <DropdownMenuItem onClick={onExportEachRootAsFile}>Export Each Root as File</DropdownMenuItem>
          <DropdownMenuItem onClick={onExportStandaloneHTML}>Export as Standalone HTML</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onCreateJsonFromSelection} disabled={!hasSelection}>
            Export Selected Widget (JSON)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mt-6 text-xs font-semibold text-gray-700 mb-2">AI & Generation</div>
      <div className="flex flex-col gap-2">
        <Button className="w-full" onClick={onOpenChat}>
          Build with AI Chat
        </Button>
        <Button variant="outline" className="w-full bg-transparent" onClick={onGenerateTwoWays}>
          Generate Two Variants
        </Button>
      </div>

      <div className="mt-4 text-xs font-semibold text-gray-700 mb-2">JSON Operations</div>
      <div className="flex flex-col gap-2">
        <Button variant="secondary" className="w-full" onClick={onOpenImport}>
          Import Schema JSON
        </Button>
        <Button variant="ghost" className="w-full" onClick={onOpenWidgetDialog}>
          Add Widget from JSON
        </Button>
        {hasSelection && (
          <Button variant="outline" className="w-full bg-transparent" onClick={onCreateJsonFromSelection}>
            📤 Export Selected Widget
          </Button>
        )}
      </div>

      <div className="mt-2">
        <Button variant="ghost" className="w-full justify-start" onClick={onLoadExample}>
          Load Example
        </Button>
      </div>
    </aside>
  )
}
