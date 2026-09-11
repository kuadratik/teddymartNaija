import {Icon} from '@iconify/react'
import React from 'react'
import {useDebounce} from 'react-use'
import {twMerge} from 'tailwind-merge'

interface IProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  placeholder: string
  className?: string
  debounceTimer: number
  iconColor?: string
  searchClass?: string
  iconName?: string
  autoComplete?: string
}

const InputSearch: React.FC<IProps> = ({
  search,
  setSearch,
  placeholder,
  className,
  debounceTimer,
  iconColor,
  searchClass = 'left-4',
  iconName,
  autoComplete = 'off'
}) => {
  const [debouncedSearch, setDebouncedSearch] = React.useState(search)

  useDebounce(
    () => {
      setSearch(debouncedSearch)
    },
    debounceTimer,
    [debouncedSearch]
  )

  return (
    <div className="relative w-full">
      <Icon
        icon={iconName ? iconName : 'iconamoon:search-light'}
        className={twMerge('absolute top-1/2 -translate-y-1/2', iconColor, searchClass)}
      />
      <input
        type="text"
        className={twMerge(
          'w-full rounded-[8px] border border-gray-200 bg-[#FAFAFA] py-[11px] pl-10 pr-[40px] shadow-f1 placeholder:text-[12px] hover:border-black focus:outline-none focus:ring-1 focus:ring-black',
          className
        )}
        placeholder={placeholder}
        name="search"
        id="search"
        autoComplete={autoComplete}
        onChange={e => setDebouncedSearch(e.target.value)}
        value={debouncedSearch}
      />
    </div>
  )
}

export default InputSearch
