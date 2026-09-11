import {useState, useCallback} from 'react'

interface DragItem {
  id: string
  [key: string]: any
}

interface UseDragAndDropOptions<T extends DragItem> {
  items: T[]
  onReorder: (newItems: T[]) => void
  /**
   * Optional filter to determine which items can be dragged/dropped
   * For example, to only allow main nav items: (item) => !item.isSubNav
   */
  canDrag?: (item: T) => boolean
  /**
   * Optional function to get child items for nested structures
   * Returns child items for a given parent ID
   */
  getChildren?: (parentId: string) => T[]
  /**
   * Optional function to rebuild the full array with children after reordering
   * Used when dealing with nested structures (parent-child relationships)
   */
  rebuildWithChildren?: (reorderedItems: T[], allItems: T[]) => T[]
}

interface UseDragAndDropReturn {
  draggedItem: string | null
  draggedOverItem: string | null
  handleDragStart: (e: React.DragEvent, itemId: string) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDragEnter: (e: React.DragEvent, itemId: string) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragEnd: () => void
  handleDrop: (targetId: string) => void
  getDragItemClassName: (itemId: string) => string
}

/**
 * Custom hook for drag-and-drop reordering functionality
 *
 * @example
 * // Simple list reordering
 * const {draggedItem, handleDragStart, handleDrop, ...dragHandlers} = useDragAndDrop({
 *   items: myList,
 *   onReorder: setMyList
 * })
 *
 * @example
 * // With filtering (only allow main items to be dragged)
 * const mainNavDrag = useDragAndDrop({
 *   items: navLinks,
 *   onReorder: setNavLinks,
 *   canDrag: (item) => !item.isSubNav,
 *   rebuildWithChildren: (reorderedMainNavs, allItems) => {
 *     const result = []
 *     reorderedMainNavs.forEach(mainNav => {
 *       result.push(mainNav)
 *       result.push(...allItems.filter(item => item.parentId === mainNav.id))
 *     })
 *     return result
 *   }
 * })
 */
export function useDragAndDrop<T extends DragItem>({
  items,
  onReorder,
  canDrag,
  rebuildWithChildren
}: UseDragAndDropOptions<T>): UseDragAndDropReturn {
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
    // Only clear if we're leaving the current target element
    if (e.currentTarget === e.target) {
      setDraggedOverItem(null)
    }
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setDraggedOverItem(null)
  }, [])

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!draggedItem || draggedItem === targetId) {
        setDraggedItem(null)
        setDraggedOverItem(null)
        return
      }

      // Get items that can be reordered
      const draggableItems = canDrag ? items.filter(canDrag) : items

      const draggedItemObj = items.find(item => item.id === draggedItem)
      const targetItemObj = items.find(item => item.id === targetId)

      // Validate items
      if (!draggedItemObj || !targetItemObj) {
        setDraggedItem(null)
        setDraggedOverItem(null)
        return
      }

      // If using canDrag, ensure both items pass the filter
      if (canDrag && (!canDrag(draggedItemObj) || !canDrag(targetItemObj))) {
        setDraggedItem(null)
        setDraggedOverItem(null)
        return
      }

      const draggedIndex = draggableItems.findIndex(item => item.id === draggedItem)
      const targetIndex = draggableItems.findIndex(item => item.id === targetId)

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedItem(null)
        setDraggedOverItem(null)
        return
      }

      // Reorder items
      const newOrder = [...draggableItems]
      const [draggedItemData] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedItemData)

      // If rebuildWithChildren is provided, use it to rebuild the full array
      const finalOrder = rebuildWithChildren ? rebuildWithChildren(newOrder, items) : newOrder

      onReorder(finalOrder)
      setDraggedItem(null)
      setDraggedOverItem(null)
    },
    [draggedItem, items, canDrag, rebuildWithChildren, onReorder]
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
    handleDrop,
    getDragItemClassName
  }
}
