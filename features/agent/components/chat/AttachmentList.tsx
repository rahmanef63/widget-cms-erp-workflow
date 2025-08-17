"use client"
import { Badge } from "@/components/ui/badge"

interface Attachment {
  name: string
}

interface AttachmentListProps {
  attachments: Attachment[]
  onRemoveAttachment: (index: number) => void
}

export function AttachmentList({ attachments, onRemoveAttachment }: AttachmentListProps) {
  if (attachments.length === 0) return null

  return (
    <div className="py-3 border-t">
      <div className="text-xs font-medium text-muted-foreground mb-2">Attachments</div>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={() => onRemoveAttachment(i)}
          >
            {attachment.name} ×
          </Badge>
        ))}
      </div>
    </div>
  )
}
