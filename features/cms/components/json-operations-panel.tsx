"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileJson, Download, Upload, Puzzle } from "lucide-react"

interface JsonOperationsPanelProps {
  hasSelection: boolean
  onImportSchema: () => void
  onExportSchema: () => void
  onCreateWidget: () => void
  onExportWidget: () => void
}

export function JsonOperationsPanel({
  hasSelection,
  onImportSchema,
  onExportSchema,
  onCreateWidget,
  onExportWidget,
}: JsonOperationsPanelProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileJson className="h-4 w-4" />
          JSON Operations
        </CardTitle>
        <CardDescription className="text-xs">Import, export, and manage JSON schemas and widgets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Schema Operations */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Schema
            </Badge>
            <span className="text-xs text-gray-600">Full canvas operations</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onImportSchema}
              className="flex items-center gap-1 text-xs bg-transparent"
            >
              <Upload className="h-3 w-3" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExportSchema}
              className="flex items-center gap-1 text-xs bg-transparent"
            >
              <Download className="h-3 w-3" />
              Export
            </Button>
          </div>
        </div>

        {/* Widget Operations */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Widget
            </Badge>
            <span className="text-xs text-gray-600">Reusable components</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="ghost" size="sm" onClick={onCreateWidget} className="flex items-center gap-1 text-xs">
              <Puzzle className="h-3 w-3" />
              Add Widget
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExportWidget}
              disabled={!hasSelection}
              className="flex items-center gap-1 text-xs"
            >
              <Download className="h-3 w-3" />
              Export Selected
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        {hasSelection && (
          <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs font-medium text-blue-800 mb-1">Widget Ready for Export</div>
            <div className="text-[10px] text-blue-600">
              Selected widget and its children can be exported as reusable JSON.
            </div>
          </div>
        )}

        {!hasSelection && (
          <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-[10px] text-gray-600">
              Select a widget on the canvas to enable widget export functionality.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
