"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Upload, Download, Layers, FileDown } from "lucide-react"
import { ToolbarActions } from "../../lib/actions"

interface ImportExportSectionProps {
  onImportWorkflow?: (data: any) => void
  onExportWorkflow?: () => any
  onImportComponents?: (data: any) => void
  onExportComponents?: () => any
  onShareLink?: () => void
}

export function ImportExportSection({
  onImportWorkflow,
  onExportWorkflow,
  onImportComponents,
  onExportComponents,
  onShareLink,
}: ImportExportSectionProps) {
  const handleImportSchema = async () => {
    await ToolbarActions.importSchema(onImportWorkflow)
  }

  const handleExportSchema = async () => {
    await ToolbarActions.exportSchema(onExportWorkflow)
  }

  const handleImportWidget = async () => {
    ToolbarActions.logAction("import-widget")
    onImportComponents?.({})
  }

  const handleExportCode = () => {
    ToolbarActions.logAction("export-code")
    onExportComponents?.()
  }

  const handleShareLink = () => {
    ToolbarActions.logAction("share-link")
    onShareLink?.()
  }

  return (
    <TooltipProvider>
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Upload className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>Import</TooltipContent>
              </Tooltip>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleImportSchema}>
              <Upload className="mr-2 h-4 w-4" />
              Import Schema
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportWidget}>
              <Layers className="mr-2 h-4 w-4" />
              Import Widget
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Download className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent>Export</TooltipContent>
              </Tooltip>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportSchema}>
              <Download className="mr-2 h-4 w-4" />
              Export Schema
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCode}>
              <Layers className="mr-2 h-4 w-4" />
              Export as Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShareLink}>
              <FileDown className="mr-2 h-4 w-4" />
              Share Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    </TooltipProvider>
  )
}
