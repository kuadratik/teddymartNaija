import TextComponent from '@/components/SharedUI/TextComponent'
import {Icon} from '@iconify/react'
import {Table, Tag, Tooltip} from 'antd'
import type {ColumnsType} from 'antd/es/table'
import Image from 'next/image'
import React, {useState} from 'react'

export interface BrandData {
  key: string
  id: string
  brandName: string
  logo?: string
  owner: string
  category: string
  status: 'active' | 'inactive' | 'pending'
  totalProducts: number
  revenue: string
  createdAt: string
}

interface ActiveBrandsTableProps {
  brands: BrandData[]
  loading?: boolean
  onViewDetails?: (brand: BrandData) => void
  onEditBrand?: (brand: BrandData) => void
  onToggleStatus?: (brand: BrandData) => void
}

const ActiveBrandsTable: React.FC<ActiveBrandsTableProps> = ({
  brands,
  loading = false,
  onViewDetails,
  onEditBrand,
  onToggleStatus
}) => {
  const [searchText, setSearchText] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'red'
      case 'pending':
        return 'orange'
      default:
        return 'default'
    }
  }

  const columns: ColumnsType<BrandData> = [
    {
      title: 'Brand',
      dataIndex: 'brandName',
      key: 'brandName',
      width: 250,
      render: (text: string, record: BrandData) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {record.logo ? (
              <Image src={record.logo} alt={text} width={40} height={40} className="h-full w-full object-cover" />
            ) : (
              <Icon icon="heroicons:building-storefront" className="text-2xl text-gray-400" />
            )}
          </div>
          <div className="flex flex-col">
            <TextComponent as="p" className="text-[14px] font-medium text-gray-900">
              {text}
            </TextComponent>
            <TextComponent as="p" className="text-[12px] text-gray-500">
              ID: {record.id}
            </TextComponent>
          </div>
        </div>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.brandName.toLowerCase().includes(value.toString().toLowerCase()) ||
        record.owner.toLowerCase().includes(value.toString().toLowerCase())
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 180,
      render: (text: string) => (
        <TextComponent as="p" className="text-[14px] text-gray-700">
          {text}
        </TextComponent>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (text: string) => (
        <Tag color="blue" className="rounded-md">
          {text}
        </Tag>
      )
    },
    {
      title: 'Products',
      dataIndex: 'totalProducts',
      key: 'totalProducts',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.totalProducts - b.totalProducts,
      render: (text: number) => (
        <TextComponent as="p" className="text-[14px] font-medium text-gray-900">
          {text.toLocaleString()}
        </TextComponent>
      )
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 130,
      align: 'right',
      render: (text: string) => (
        <TextComponent as="p" className="text-[14px] font-semibold text-green-600">
          {text}
        </TextComponent>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      filters: [
        {text: 'Active', value: 'active'},
        {text: 'Inactive', value: 'inactive'},
        {text: 'Pending', value: 'pending'}
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="rounded-md capitalize">
          {status}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (text: string) => (
        <TextComponent as="p" className="text-[13px] text-gray-600">
          {text}
        </TextComponent>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record: BrandData) => (
        <div className="flex items-center justify-center gap-2">
          <Tooltip title="View Details">
            <button
              title="View Brand Details"
              onClick={() => onViewDetails?.(record)}
              className="rounded-md p-2 text-blue-600 transition-colors hover:bg-blue-50"
            >
              <Icon icon="heroicons:eye" className="text-lg" />
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              title="Edit Brand"
              onClick={() => onEditBrand?.(record)}
              className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100"
            >
              <Icon icon="heroicons:pencil" className="text-lg" />
            </button>
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
            <button
              title="Toggle Brand Status"
              onClick={() => onToggleStatus?.(record)}
              className={`rounded-md p-2 transition-colors ${
                record.status === 'active' ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
              }`}
            >
              <Icon
                icon={record.status === 'active' ? 'heroicons:x-circle' : 'heroicons:check-circle'}
                className="text-lg"
              />
            </button>
          </Tooltip>
        </div>
      )
    }
  ]

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <TextComponent as="h2" className="text-[20px] font-semibold text-gray-900">
            Active Brands
          </TextComponent>
          <TextComponent as="p" className="mt-1 text-[14px] text-gray-500">
            Manage and monitor all registered brands
          </TextComponent>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon
              icon="heroicons:magnifying-glass"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search brands..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
            <Icon icon="heroicons:plus" className="text-lg" />
            Add Brand
          </button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={brands}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} brands`
        }}
        scroll={{x: 1200}}
        className="custom-table"
      />
    </div>
  )
}

export default ActiveBrandsTable
