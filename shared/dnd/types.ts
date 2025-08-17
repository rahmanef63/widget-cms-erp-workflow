export type DndId = string

export type DndItem = {
  id: DndId
  label?: string
  meta?: Record<string, any>
}

export type DndReorderHandler = (newOrder: DndId[]) => void

export type DndListOptions = {
  groupId: string // only accept drops within the same group
  items: DndItem[]
  onReorder: DndReorderHandler
}
