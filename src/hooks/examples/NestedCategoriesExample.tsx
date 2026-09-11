/**
 * Example: Nested Categories with Sub-items
 *
 * This example shows how to implement drag-and-drop for
 * a hierarchical structure with parent categories and sub-items.
 */

import React, {useState} from 'react'
import {useDragAndDrop} from '@/hooks/useDragAndDrop'
import {useSubNavDragAndDrop} from '@/hooks/useSubNavDragAndDrop'
import {Icon} from '@iconify/react'

interface CategoryItem {
  id: string
  name: string
  icon: string
  isSubCategory?: boolean
  parentId?: string
}

const NestedCategoriesExample = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([
    {id: '1', name: 'Electronics', icon: 'mdi:laptop'},
    {id: '1-1', name: 'Laptops', icon: 'mdi:laptop', isSubCategory: true, parentId: '1'},
    {id: '1-2', name: 'Phones', icon: 'mdi:cellphone', isSubCategory: true, parentId: '1'},
    {id: '1-3', name: 'Tablets', icon: 'mdi:tablet', isSubCategory: true, parentId: '1'},
    {id: '2', name: 'Clothing', icon: 'mdi:tshirt-crew'},
    {id: '2-1', name: 'Shirts', icon: 'mdi:tshirt-crew', isSubCategory: true, parentId: '2'},
    {id: '2-2', name: 'Pants', icon: 'mdi:hanger', isSubCategory: true, parentId: '2'},
    {id: '3', name: 'Books', icon: 'mdi:book-open-variant'}
  ])

  const [expandedCategories, setExpandedCategories] = useState<string[]>(['1', '2'])

  const hasSubCategories = (categoryId: string) => {
    return categories.some(cat => cat.parentId === categoryId)
  }

  const getSubCategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId)
  }

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    )
  }

  // Main categories drag and drop
  const mainCategoriesDrag = useDragAndDrop({
    items: categories,
    onReorder: setCategories,
    canDrag: item => !item.isSubCategory,
    rebuildWithChildren: (reorderedMain, allItems) => {
      const result: CategoryItem[] = []
      reorderedMain.forEach(mainCat => {
        result.push(mainCat)
        const subCats = allItems.filter(item => item.parentId === mainCat.id)
        result.push(...subCats)
      })
      return result
    }
  })

  // Sub-categories drag and drop
  const subCategoriesDrag = useSubNavDragAndDrop({
    items: categories,
    onReorder: setCategories
  })

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-6 text-3xl font-bold">Product Categories</h2>

      <div className="space-y-2">
        {categories
          .filter(cat => !cat.isSubCategory)
          .map(category => (
            <div key={category.id} className="rounded-lg bg-white shadow-sm">
              {/* Main Category */}
              <div
                draggable
                onDragStart={e => mainCategoriesDrag.handleDragStart(e, category.id)}
                onDragOver={mainCategoriesDrag.handleDragOver}
                onDragEnter={e => mainCategoriesDrag.handleDragEnter(e, category.id)}
                onDragLeave={mainCategoriesDrag.handleDragLeave}
                onDrop={() => mainCategoriesDrag.handleDrop(category.id)}
                onDragEnd={mainCategoriesDrag.handleDragEnd}
                className={`flex cursor-move items-center gap-4 p-4 transition-all duration-200 ${mainCategoriesDrag.getDragItemClassName(category.id)} `}
              >
                {/* Drag Handle */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                >
                  <path
                    d="M16 9H11V4H14L10 0L6 4H9V9H4V6L0 10L4 14V11H9V16H6L10 20L14 16H11V11H16V14L20 10L16 6V9Z"
                    fill="#B8B8B8"
                  />
                </svg>

                <Icon icon={category.icon} className="text-2xl text-gray-700" />

                <span className="flex-1 text-lg font-medium">{category.name}</span>

                {/* Expand/Collapse Button */}
                {hasSubCategories(category.id) && (
                  <button
                    onClick={() => toggleExpanded(category.id)}
                    className="rounded p-2 transition-colors hover:bg-gray-100"
                  >
                    <Icon
                      icon={expandedCategories.includes(category.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                      className="text-xl"
                    />
                  </button>
                )}
              </div>

              {/* Sub-Categories */}
              {hasSubCategories(category.id) && expandedCategories.includes(category.id) && (
                <div className="space-y-1 pb-2 pl-8">
                  {getSubCategories(category.id).map(subCat => (
                    <div
                      key={subCat.id}
                      draggable
                      onDragStart={e => subCategoriesDrag.handleDragStart(e, subCat.id)}
                      onDragOver={subCategoriesDrag.handleDragOver}
                      onDragEnter={e => subCategoriesDrag.handleDragEnter(e, subCat.id)}
                      onDragLeave={subCategoriesDrag.handleDragLeave}
                      onDrop={() => subCategoriesDrag.handleDropSubNav(category.id, subCat.id)}
                      onDragEnd={subCategoriesDrag.handleDragEnd}
                      className={`mr-4 flex cursor-move items-center gap-3 rounded-lg bg-gray-50 p-3 transition-all duration-200 ${subCategoriesDrag.getDragItemClassName(subCat.id)} `}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                      >
                        <path
                          d="M16 9H11V4H14L10 0L6 4H9V9H4V6L0 10L4 14V11H9V16H6L10 20L14 16H11V11H16V14L20 10L16 6V9Z"
                          fill="#B8B8B8"
                        />
                      </svg>

                      <Icon icon={subCat.icon} className="text-lg text-gray-600" />

                      <span className="text-gray-700">{subCat.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}

export default NestedCategoriesExample
