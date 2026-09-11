import {DeleteOutlined} from '@ant-design/icons'
import type {GetRef, InputRef, TableProps} from 'antd'
import {Button, Form, Input, Popconfirm, Table, Tooltip} from 'antd'
import React, {useContext, useEffect, useRef, useState} from 'react'

type FormInstance<T> = GetRef<typeof Form<T>>

const EditableContext = React.createContext<FormInstance<any> | null>(null)

interface Item {
  key: string
  name: string
  age: string
  address: string
  [key: string]: string
}

interface EditableRowProps {
  index: number
}

const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof Item
  record: Item
  handleSave: (record: Item) => void
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const inputRef = useRef<InputRef>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const save = async () => {
    try {
      const values = await form.validateFields()
      handleSave({...record, ...values})
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  return (
    <td {...restProps}>
      {editable ? (
        <Form.Item
          style={{margin: 0}}
          name={dataIndex}
          initialValue={record[dataIndex]}
          rules={[{required: true, message: `${title} is required.`}]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

export interface DataType {
  key: React.Key
  name: string
  age: string
  address: string
  [key: string]: string | React.Key
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>

interface EditableTableType {
  dataSource: DataType[]
  setDataSource: React.Dispatch<React.SetStateAction<DataType[]>>
  columns: (
    | {
        title: string
        dataIndex: string
        width: string
        editable: boolean
        render?: undefined
      }
    | {
        title: string
        dataIndex: string
        editable: boolean
        width?: undefined
        render?: undefined
      }
    | {
        title: string
        dataIndex: string
        render: (_: any, record: any) => React.JSX.Element | null
        width?: undefined
        editable?: undefined
      }
  )[]

  setColumns: React.Dispatch<
    React.SetStateAction<
      (
        | {
            title: string
            dataIndex: string
            width: string
            editable: boolean
            render?: undefined
          }
        | {
            title: string
            dataIndex: string
            editable: boolean
            width?: undefined
            render?: undefined
          }
        | {
            title: string
            dataIndex: string
            render: (_: any, record: any) => React.JSX.Element | null
            width?: undefined
            editable?: undefined
          }
      )[]
    >
  >
}

const EditableTable: React.FC<EditableTableType> = ({dataSource, setDataSource, columns, setColumns}) => {
  const [count, setCount] = useState(() => {
    // Initialize count based on existing data to prevent key conflicts
    const maxKey = dataSource.reduce((max, item) => {
      const itemKey = typeof item.key === 'number' ? item.key : parseInt(item.key.toString(), 10)
      return isNaN(itemKey) ? max : Math.max(max, itemKey)
    }, 0)
    return maxKey + 1
  })

  const handleDeleteRow = (key: React.Key) => {
    const newData = dataSource.filter(item => item.key !== key)
    setDataSource(newData)
    // Persist the changes to localStorage
    localStorage.setItem('tableData', JSON.stringify(newData))
  }

  const handleAddRow = () => {
    // Create a new row with all existing columns
    const newData: DataType = {key: count, name: '', age: '', address: ''}

    // Add all columns from the current table structure
    columns.forEach(column => {
      if (column.dataIndex !== 'operation') {
        newData[column.dataIndex] = ''
      }
    })

    const updatedDataSource = [...dataSource, newData]
    setDataSource(updatedDataSource)
    setCount(count + 1)

    // Persist the changes to localStorage
    localStorage.setItem('tableData', JSON.stringify(updatedDataSource))
    localStorage.setItem('tableCount', String(count + 1))
  }

  const handleSave = (row: DataType) => {
    const newData = [...dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    setDataSource(newData)

    // Persist the changes to localStorage
    localStorage.setItem('tableData', JSON.stringify(newData))
  }

  const handleHeaderEdit = (index: number, newTitle: string) => {
    const newColumns = [...columns]
    newColumns[index] = {...newColumns[index], title: newTitle}
    setColumns(newColumns)

    // Persist column changes to localStorage
    localStorage.setItem('tableColumns', JSON.stringify(newColumns))
  }

  const handleAddColumn = () => {
    const newColumn = {
      title: `New Column ${columns.length - 3}`,
      dataIndex: `newCol${columns.length - 3}`,
      editable: true
    }
    const updatedColumns = [...columns.slice(0, -1), newColumn, columns[columns.length - 1]]
    setColumns(updatedColumns)

    const updatedDataSource = dataSource.map(item => ({
      ...item,
      [newColumn.dataIndex]: 'New Value'
    }))
    setDataSource(updatedDataSource)

    // Persist changes to localStorage
    localStorage.setItem('tableColumns', JSON.stringify(updatedColumns))
    localStorage.setItem('tableData', JSON.stringify(updatedDataSource))
  }

  const handleDeleteColumn = (dataIndex: string) => {
    const newColumns = columns.filter(column => column.dataIndex !== dataIndex)
    setColumns(newColumns)

    const updatedDataSource = dataSource.map(item => {
      const newItem = {...item}
      delete newItem[dataIndex]
      return newItem
    })
    setDataSource(updatedDataSource)

    // Persist changes to localStorage
    localStorage.setItem('tableColumns', JSON.stringify(newColumns))
    localStorage.setItem('tableData', JSON.stringify(updatedDataSource))
  }

  // Add effect to load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('tableData')
    const savedColumns = localStorage.getItem('tableColumns')
    const savedCount = localStorage.getItem('tableCount')

    if (savedData) {
      setDataSource(JSON.parse(savedData))
    }

    if (savedColumns) {
      setColumns(JSON.parse(savedColumns))
    }

    if (savedCount) {
      setCount(parseInt(savedCount, 10))
    }
  }, [])

  const tableColumns: any = columns.map((col, index) => ({
    ...col,
    // Add minimum width to prevent columns from shrinking too much
    width: col.width || '150px', // Use existing width or default to 150px
    ellipsis: true, // Add ellipsis for overflow text
    title: (
      <div style={{display: 'flex', alignItems: 'center'}}>
        {col.dataIndex === 'operation' ? (
          <span className="">Action</span>
        ) : (
          <>
            <Input
              defaultValue={col.title as string}
              onBlur={e => handleHeaderEdit(index, e.target.value)}
              style={{border: 'none', width: '100%'}}
            />
            <Tooltip title="Delete Column">
              <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteColumn(col.dataIndex)} />
            </Tooltip>
          </>
        )}
      </div>
    ),
    onCell: (record: DataType) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave,
      // Add minimum width to cells
      style: {minWidth: '100px'}
    })
  }))

  // Fix the render function for the delete operation
  if (tableColumns.length > 0 && tableColumns[tableColumns.length - 1].dataIndex === 'operation') {
    tableColumns[tableColumns.length - 1] = {
      ...tableColumns[tableColumns.length - 1],
      render: (_: any, record: DataType) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(record.key)}>
            <Button className="font-semibold" type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        ) : null
    }
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }

  // Determine which columns to show based on screen width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Optimize column display for mobile without hiding columns
  const getResponsiveTableProps = () => {
    // Always return all columns, but adjust table properties based on screen size
    if (windowWidth < 768) {
      return {
        size: 'small' as const,
        scroll: {x: tableColumns.length * 150}, // Set explicit minimum width based on number of columns
        className: 'mobile-table-view'
      }
    }

    return {
      size: 'middle' as const,
      scroll: {x: 'max-content'},
      className: ''
    }
  }

  return (
    <div className="responsive-table-container">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '16px'
        }}
      >
        <Button onClick={handleAddRow} type="primary">
          Add a row
        </Button>
        <Button onClick={handleAddColumn} type="primary">
          Add Column
        </Button>
      </div>
      <div style={{overflowX: 'auto', width: '100%'}}>
        {windowWidth < 768 && (
          <div
            className="scroll-indicator"
            style={{
              textAlign: 'center',
              marginBottom: '8px',
              fontSize: '12px',
              color: '#888'
            }}
          >
            ← Swipe horizontally to view all columns →
          </div>
        )}
        <Table<DataType>
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          pagination={false}
          dataSource={dataSource}
          columns={tableColumns as ColumnTypes}
          {...getResponsiveTableProps()}
          style={{
            minWidth: '100%',
            tableLayout: 'fixed' // Use fixed layout for better column width control
          }}
        />
      </div>

      {/* Add custom CSS to handle mobile view */}
      <style jsx global>{`
        @media (max-width: 767px) {
          .mobile-table-view .ant-table-cell {
            white-space: nowrap;
            min-width: 120px;
          }
          .mobile-table-view .ant-table-cell input {
            min-width: 100px;
          }
        }
      `}</style>
    </div>
  )
}

export default EditableTable
