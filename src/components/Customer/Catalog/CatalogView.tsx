import TextInput from '@/components/SharedUI/Input/TextInput'
import TextComponent from '@/components/SharedUI/TextComponent'
import {typeOptions} from '@/pages/vendor'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {Dropdown, Menu, RadioChangeEvent} from 'antd'
import React, {useCallback, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Image from 'next/image'
import useQueryParams from '@/hooks/useQueryParams'
import debounce from '@/utils/debounce'
import {useGetPopularNewQuery} from '@/services/general/general'
import {useAppSelector} from '@/hooks/reduxHooks'
import CatalogCardview from './CatalogCardview'
import CatalogFilter from './CatalogFilter'
import {useGetSearchStoreListingNewQuery} from '@/services/store'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'

const CatalogView = () => {
  const [dropDown, setDropDown] = useState(false)

  const [clipUuid, setClipUuid] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uuid = localStorage.getItem('Clip-Uid')
      setClipUuid(uuid)
    }
  }, []) // Run only once on mount

  const {queryParams, updateQueryParams} = useQueryParams<{q: string; type: 'product' | 'service'; category?: string}>({
    q: '',
    type: 'product'
  })

  const [queryString, setQueryString] = useState(queryParams?.q ?? '')

  // * This debounce function update the search queryParams and delays executing the api request
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      updateQueryParams({
        q: value ?? ''
      })
    }, 1000),
    []
  )

  const {type} = useSelector((state: any) => state.vendor)
  const dispatch = useDispatch()

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    updateQueryParams({
      type: value
    })
  }

  const {selectedLanguage} = useAppSelector(state => state.country)
  const {data, isLoading, refetch, isFetching} = useGetSearchStoreListingNewQuery({
    listType: queryParams.type,
    search: queryParams.q,
    uuid: JSON.parse(clipUuid),
    currency: selectedLanguage.value
  })

  //   const {data, isLoading} = useGetPopularNewQuery({
  //     listingType: queryParams.type,
  //     currency: selectedLanguage.value
  //   })

  return (
    <div className="">
      <div className="gap-6 md:flex">
        <div className="flex-shrink-0 md:w-[350px]">
          <CatalogFilter />
        </div>

        <div className="flex-[4]">
          <div className="relative w-full border-[1px] border-gray-50">
            <div className="absolute left-4 top-1/2 z-40 flex h-[20px] w-[87px] -translate-y-1/2 items-start justify-start border-r border-r-gray-300 pr-[13px]">
              <Dropdown
                overlay={
                  <Menu className="flex flex-col gap-1">
                    {typeOptions.map((option, index) => (
                      <p
                        key={option.value}
                        onClick={() => {
                          handleChange(option.value)
                          setDropDown(false)
                        }}
                        className="cursor-pointer rounded-lg p-2 visited:text-[#27104E] hover:bg-gray-100"
                      >
                        {option.label}
                      </p>
                    ))}
                  </Menu>
                }
                trigger={['click']}
                open={dropDown}
                onOpenChange={visible => {
                  setDropDown(visible)
                }}
              >
                <div className="flex h-[24px] cursor-pointer flex-row items-center gap-2 font-inter text-sm font-medium text-[#33357D]">
                  <TextComponent as="span" className="text-[14px] font-medium capitalize leading-[13px]">
                    {queryParams?.type}
                  </TextComponent>
                  <Image src="/assets/downArrow.svg" alt="down arrow" width={12} height={12} className="" />
                </div>
              </Dropdown>
            </div>
            <TextInput
              iconName="iconamoon:category"
              iconClassName="cursor-pointer"
              className="pl-[125px]"
              placeholder={`Search for a ${type} or vendor`}
              onChange={e => {
                setQueryString(e.target.value)
                debouncedSearch(e.target.value as string)
              }}
              name={'query'}
              value={queryString ?? ''}
              type={'text'}
            />
          </div>
          <CatalogCardview data={data} isFetching={isFetching} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default CatalogView
