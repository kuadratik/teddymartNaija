import React, {useState} from 'react'
import {StyledTable} from '../Order/OrderDetailsTable'
import {ColumnsType} from 'antd/es/table'
import TextComponent from '@/components/SharedUI/TextComponent'
import {StyledContentWrapper} from '../Order/OrderLogisticsView'
import {Button, Dropdown, Rate} from 'antd'
import {Icon} from '@iconify/react'

const ReviewData = [
  {
    email: 'Freida_Ward65@hotmail.com',
    name: 'Kristie Schinner',
    stock: '04',
    review:
      'Figma ipsum component variant main layer. Asset flatten bullet scale layer. Object layer layer connection layer underline share style inspect. Prototype pencil bold horizontal rotate reesizing pixel image flatten. Arrow fill inspect align figma. Hand font distribute move underline line rectangle ellipse. Layout boolean flows frame thumbnail. Layout.',
    rating: 5,
    date: '09/24/2024'
  },
  {
    email: 'Freida_Ward65@hotmail.com',
    name: 'Kristie Schinner',
    stock: '04',
    review:
      'Figma ipsum component variant main layer. Asset flatten bullet scale layer. Object layer layer connection layer underline share style inspect. Prototype pencil bold horizontal rotate reesizing pixel image flatten. Arrow fill inspect align figma. Hand font distribute move underline line rectangle ellipse. Layout boolean flows frame thumbnail. Layout.',
    rating: 5,
    date: '09/24/2024'
  },
  {
    email: 'Freida_Ward65@hotmail.com',
    name: 'Kristie Schinner',
    stock: '04',
    review:
      'Figma ipsum component variant main layer. Asset flatten bullet scale layer. Object layer layer connection layer underline share style inspect. Prototype pencil bold horizontal rotate reesizing pixel image flatten. Arrow fill inspect align figma. Hand font distribute move underline line rectangle ellipse. Layout boolean flows frame thumbnail. Layout.',
    rating: 5,
    date: '09/24/2024'
  },
  {
    email: 'Freida_Ward65@hotmail.com',
    name: 'Kristie Schinner',
    stock: '04',
    review:
      'Figma ipsum component variant main layer. Asset flatten bullet scale layer. Object layer layer connection layer underline share style inspect. Prototype pencil bold horizontal rotate reesizing pixel image flatten. Arrow fill inspect align figma. Hand font distribute move underline line rectangle ellipse. Layout boolean flows frame thumbnail. Layout.',
    rating: 5,
    date: '09/24/2024'
  }
]

const Reviewtable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])

  const onSelectChange = (newSelectedRowKeys: React.SetStateAction<any>) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const columns: ColumnsType<any> = React.useMemo(() => {
    return [
      {
        key: 'email',
        title: 'Email',
        dataIndex: 'email'
      },
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name'
      },
      {
        key: 'review',
        title: (
          <span style={{textAlign: 'center'}} className="ml-48">
            Review{' '}
          </span>
        ),

        dataIndex: 'review',
        render: (text, record) => (
          <TextComponent
            as="p"
            className="whitespace-wrap font-normal !text-[#6b7280] md:w-[500px] md:whitespace-normal"
          >
            {text}
          </TextComponent>
        )
      },

      {
        key: 'rating',
        title: (
          <span style={{textAlign: 'center'}} className="ml-4">
            Rating{' '}
          </span>
        ),
        dataIndex: 'rating',
        render: (text, record) => <Rate disabled className="text-base" value={text} />
      },

      {
        key: 'date',
        title: 'Date',
        dataIndex: 'date'
      },
      {
        title: 'Action',
        key: 'action',
        align: 'center',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (record: any) => (
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  label: 'View',
                  key: '1'
                },

                {
                  label: 'Edit',
                  key: '2'
                }
              ]
            }}
          >
            <Button className="border-none">
              <Icon icon="tabler:dots" className="text-2xl" />{' '}
            </Button>
          </Dropdown>
        )
      }
    ]
  }, [])

  return (
    <div className="mt-[47px]">
      <StyledContentWrapper className="!p-0">
        <div className="flex flex-col">
          <StyledTable
            rowClassName={'no-selected-row'}
            // loading={isPending || isFetching}
            className="custom-table"
            columns={columns}
            rowSelection={rowSelection}
            dataSource={ReviewData}
            pagination={false}
          />
        </div>
      </StyledContentWrapper>{' '}
    </div>
  )
}

export default Reviewtable
