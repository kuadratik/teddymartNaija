import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'

interface IProps {
  data: any
  onChange: (value: any) => void
  value: any
  disabled?: boolean
  backgroundColor?: string
  placeholder?: string
  notFoundContent?: any
  loading?: boolean
  pageSize?: number
  next_page_url?: string
  setCurrentPage?: any
  refetch?: any
  variant?: 'borderless' | 'filled' | 'outlined'
  className?: string
  setSearchSelect?: any
  handleSearchSelect?: any
}

const SelectWithInfiniteScroll = ({
  data,
  onChange,
  value,
  disabled,
  backgroundColor,
  placeholder,
  refetch,
  setCurrentPage,
  loading,
  next_page_url,
  handleSearchSelect,
  pageSize,
  variant,
  className,
  notFoundContent
}: IProps) => {
  const [hasMore, setHasMore] = useState(true)
  const [scrollingUp, setScrollingUp] = useState(false)
  const handleChange = (selectedValue: string): void => {
    onChange(selectedValue) // Pass the selected value directly
  }

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement // Cast target to HTMLDivElement
    if (target.scrollTop === 0) {
      setScrollingUp(true)
      setCurrentPage(1)
      refetch()
    } else if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setScrollingUp(false)

      refetch()
      if (data.length === pageSize) {
        setCurrentPage((prevPage: number) => prevPage + 1)
        refetch()
      } else {
        setHasMore(false)
      }
    }
  }

  useEffect(() => {
    if (scrollingUp) {
      setCurrentPage(1)
    }
  }, [scrollingUp, setCurrentPage])

  return (
    <div
      style={{
        backgroundColor:
          backgroundColor === null || backgroundColor === undefined || backgroundColor === '' ? '' : backgroundColor
      }}
      className={twJoin(
        'w-full rounded-[8px] border border-[#dfdcdc]  p-[1px] hover:border-school focus:outline-none focus:ring-1 focus:ring-school',
        ` ${variant === 'borderless' ? `${className!}` : ''}`
      )}
    >
      <Select
        showSearch
        variant={variant ? variant : 'borderless'}
        defaultValue={value ? value : ''}
        value={value}
        size="large"
        placeholder={placeholder}
        style={{ width: '100%', borderRadius: '8px' }}
        className=""
        disabled={disabled}
        onChange={handleChange}
        notFoundContent={notFoundContent}
        onPopupScroll={handlePopupScroll}
        options={data}
        onSearch={handleSearchSelect}
        filterOption={
          handleSearchSelect
            ? false
            : (input, option) => {
                const label = option?.label
                return typeof label === 'string' && label.toLowerCase().includes(input.toLowerCase())
              }
        }
      />
    </div>
  )
}

export default SelectWithInfiniteScroll
