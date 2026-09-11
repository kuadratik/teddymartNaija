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
  // const [dataSource, setDataSource] = useState<DataType[]>([
  //   {
  //     key: '0',
  //     name: '',
  //     age: '',
  //     address: ''
  //   },
  //   {
  //     key: '1',
  //     name: '',
  //     age: '',
  //     address: ''
  //   },
  //   {
  //     key: '2',
  //     name: '',
  //     age: '',
  //     address: ''
  //   }
  // ])

  const [count, setCount] = useState(2)
  // const [columns, setColumns] = useState([
  //   {
  //     title: '',
  //     dataIndex: 'name',
  //     width: '30%',
  //     editable: true
  //   },
  //   {
  //     title: '',
  //     dataIndex: 'age',
  //     editable: true
  //   },
  //   {
  //     title: '',
  //     dataIndex: 'address',
  //     editable: true
  //   },
  //   {
  //     title: '',
  //     dataIndex: 'operation',
  //     render: (_: any, record: any) =>
  //       dataSource.length >= 1 ? (
  //         <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRow(record.key)}>
  //           <a>Delete</a>
  //         </Popconfirm>
  //       ) : null
  //   }
  // ])

  console.log('dataSource', dataSource)
  console.log('columns', columns)

  console.log('stringifyColumns', JSON.stringify(columns))
  console.log('dataSource', JSON.stringify(dataSource))

  // const handleDeleteRow = (key: React.Key) => {
  //   const newData = dataSource.filter(item => item.key !== key)
  //   setDataSource(newData)
  // }

  const handleAddRow = () => {
    const newData: DataType = {
      key: count,
      name: ``,
      age: '',
      address: ``
    }
    setDataSource([...dataSource, newData])
    setCount(count + 1)
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
  }

  const handleHeaderEdit = (index: number, newTitle: string) => {
    const newColumns = [...columns]
    newColumns[index] = {...newColumns[index], title: newTitle}
    setColumns(newColumns)
  }

  const handleAddColumn = () => {
    const newColumn = {
      title: `New Column ${columns.length - 3}`,
      dataIndex: `newCol${columns.length - 3}`,
      editable: true
    }
    setColumns([...columns.slice(0, -1), newColumn, columns[columns.length - 1]])

    const updatedDataSource = dataSource.map(item => ({
      ...item,
      [newColumn.dataIndex]: 'New Value'
    }))
    setDataSource(updatedDataSource)
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
  }

  const tableColumns = columns.map((col, index) => ({
    ...col,
    title: (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <Input
          defaultValue={col.title as string}
          onBlur={e => handleHeaderEdit(index, e.target.value)}
          style={{border: 'none', width: '100%'}}
        />
        {col.dataIndex !== 'operation' && (
          <Tooltip title="Delete Column">
            <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteColumn(col.dataIndex)} />
          </Tooltip>
        )}
      </div>
    ),
    onCell: (record: DataType) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave
    })
  }))

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }

  return (
    <div>
      <Button onClick={handleAddRow} type="primary" style={{marginBottom: 16}}>
        Add a row
      </Button>
      <Button onClick={handleAddColumn} type="primary" style={{marginLeft: 16, marginBottom: 16}}>
        Add Column
      </Button>
      <Table<DataType>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        pagination={false}
        dataSource={dataSource}
        columns={tableColumns as ColumnTypes}
      />
    </div>
  )
}

export default EditableTable
