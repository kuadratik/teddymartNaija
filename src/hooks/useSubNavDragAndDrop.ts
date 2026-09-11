import {useState, useCallback} from 'react'

interface DragItem {
  id: string
  [key: string]: any
}

interface UseSubNavDragAndDropOptions<T extends DragItem> {
  items: T[]
  onReorder: (newItems: T[]) => void
  parentIdKey?: string // Key to access parent ID (default: 'parentId')
}

interface UseSubNavDragAndDropReturn {
  draggedItem: string | null
  draggedOverItem: string | null
  handleDragStart: (e: React.DragEvent, itemId: string) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragEnter: (e: React.DragEvent, itemId: string) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragEnd: () => void
  handleDropSubNav: (parentId: string, targetId: string) => void
  getDragItemClassName: (itemId: string) => string
}

/**
 * Custom hook for drag-and-drop reordering of sub-navigation items
 * Sub-navs can only be reordered within their parent group
 *
 * @example
 * const subNavDrag = useSubNavDragAndDrop({
 *   items: navLinks,
 *   onReorder: setNavLinks
 * })
 *
 * // In your JSX
 * <div
 *   draggable
 *   onDragStart={(e) => subNavDrag.handleDragStart(e, subItem.id)}
 *   onDrop={() => subNavDrag.handleDropSubNav(parentId, subItem.id)}
 *   {...otherDragHandlers}
 * />
 */
export function useSubNavDragAndDrop<T extends DragItem>({
  items,
  onReorder,
  parentIdKey = 'parentId'
}: UseSubNavDragAndDropOptions<T>): UseSubNavDragAndDropReturn {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedOverItem, setDraggedOverItem] = useState<string | null>(null)

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    e.stopPropagation()
    setDraggedItem(itemId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDragEnter = useCallback(
    (e: React.DragEvent, itemId: string) => {
      e.stopPropagation()
      if (draggedItem !== itemId) {
        setDraggedOverItem(itemId)
      }
    },
    [draggedItem]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.stopPropagation()
    if (e.currentTarget === e.target) {
      setDraggedOverItem(null)
    }
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDraggedOverItem(null)
  }, [])

  const handleDropSubNav = useCallback(
    (parentId: string, targetId: string) => {
      if (!draggedItem || draggedItem === targetId) {
        setDraggedItem(null)
        setDraggedOverItem(null)
        return
      }

      // Get all sub-items for this parent
      const subItems = items.filter(item => item[parentIdKey] === parentId)
      const draggedIndex = subItems.findIndex(item => item.id === draggedItem)
      const targetIndex = subItems.findIndex(item => item.id === targetId)

      // If dragged item is not in this parent's sub-items, don't reorder
      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedItem(null)
        setDraggedOverItem(null)
        return
      }

      // Find indices in the full items array
      const draggedItemFullIndex = items.findIndex(item => item.id === draggedItem)
      const targetItemFullIndex = items.findIndex(item => item.id === targetId)

      if (draggedItemFullIndex === -1 || targetItemFullIndex === -1) {
        setDraggedItem(null)
        setDraggedOverItem(null)
        return
      }

      // Reorder in the full array
      const newItems = [...items]
      const [draggedItemData] = newItems.splice(draggedItemFullIndex, 1)
      newItems.splice(targetItemFullIndex, 0, draggedItemData)

      onReorder(newItems)
      setDraggedItem(null)
      setDraggedOverItem(null)
    },
    [draggedItem, items, parentIdKey, onReorder]
  )

  const getDragItemClassName = useCallback(
    (itemId: string) => {
      const classes = []

      if (draggedItem === itemId) {
        classes.push('opacity-50')
      }

      if (draggedOverItem === itemId && draggedItem !== itemId) {
        classes.push('border-l-4 border-l-black')
      }

      return classes.join(' ')
    },
    [draggedItem, draggedOverItem]
  )

  return {
    draggedItem,
    draggedOverItem,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDragEnd,
    handleDropSubNav,
    getDragItemClassName
  }
}
