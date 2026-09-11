/**
 * Example: Simple List Reordering
 *
 * This example shows how to implement drag-and-drop reordering
 * for a simple list of items.
 */

import React, {useState} from 'react'
import {useDragAndDrop} from '@/hooks/useDragAndDrop'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

const TodoListExample = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    {id: '1', text: 'Buy groceries', completed: false},
    {id: '2', text: 'Walk the dog', completed: false},
    {id: '3', text: 'Read a book', completed: true},
    {id: '4', text: 'Write code', completed: false}
  ])

  const drag = useDragAndDrop({
    items: todos,
    onReorder: setTodos
  })

  return (
    <div className="mx-auto max-w-md p-4">
      <h2 className="mb-4 text-2xl font-bold">My Todo List</h2>
      <div className="space-y-2">
        {todos.map(todo => (
          <div
            key={todo.id}
            draggable
            onDragStart={e => drag.handleDragStart(e, todo.id)}
            onDragOver={drag.handleDragOver}
            onDragEnter={e => drag.handleDragEnter(e, todo.id)}
            onDragLeave={drag.handleDragLeave}
            onDrop={() => drag.handleDrop(todo.id)}
            onDragEnd={drag.handleDragEnd}
            className={`flex cursor-move items-center gap-3 rounded-lg bg-white p-4 shadow transition-all duration-200 ${drag.getDragItemClassName(todo.id)} `}
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

            {/* Checkbox */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {
                setTodos(prev => prev.map(t => (t.id === todo.id ? {...t, completed: !t.completed} : t)))
              }}
              className="h-5 w-5"
            />

            {/* Text */}
            <span className={todo.completed ? 'text-gray-500 line-through' : ''}>{todo.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TodoListExample
