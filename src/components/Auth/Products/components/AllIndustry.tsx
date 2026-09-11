import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import TextComponent from '@/components/SharedUI/TextComponent'

import {useMediaQuery} from '@/hooks/use-media-query'
import {Icon} from '@iconify/react'
import {Drawer} from 'antd'
import React, {useState} from 'react'

export interface ISelectedIndustry {
  id: number
  name: string
}

interface IIndustryProps {
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedIndustry[]>>
  industries: any
  selectedCategories: ISelectedIndustry[]
}

const AllIndustry = ({open, setOpen, setSelectedCategories, industries, selectedCategories}: IIndustryProps) => {
  console.log('🚀 ~ AllIndustry ~ selectedCategories:', selectedCategories)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [search, setSearch] = useState('')

  const handleIndustryClick = (category: ISelectedIndustry) => {
    setSelectedCategories(prevSelected => {
      const isAlreadySelected = prevSelected.some(selected => selected.id === category.id)

      if (isAlreadySelected) {
        return prevSelected.filter(selected => selected.id !== category.id)
      } else {
        return [...prevSelected, {id: category.id, name: category.name}]
      }
    })
  }

  const onClose = () => {
    setOpen && setOpen(false)
  }

  return (
    <section className="w-full">
      {isDesktop ? (
        <PlannerModal className="rounded-sm" modalOpen={open!} setModalOpen={setOpen!} onCloseModal={onClose}>
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col items-center justify-center !p-0">
              <TextComponent as="h1" className="text-[16px] font-semibold leading-[32px] text-[#000000]">
                Industry
              </TextComponent>
            </div>

            <span
              className="cursor-pointer hover:opacity-60"
              onClick={() => {
                onClose()
              }}
            >
              <Icon icon={'mdi:close'} className="text-[24px]" />
            </span>
          </div>
          <div className="my-6 w-full">
            <TextInput
              placeholder="Search industry..."
              onChange={e => setSearch(e.target.value)}
              name={'industrySearch'}
              iconClassName=""
              value={search}
              iconName='mdi:magnify'
              type={'text'}
            />
          </div>
          <div className="mt-4 flex flex-col items-start gap-2 overflow-scroll px-[10px] lg:px-[24px]">
            {industries?.data
              .filter((category: {name: string}) => category.name.toLowerCase().includes(search.toLowerCase()))
              .map((category: ISelectedIndustry, i: React.Key | null | undefined) => (
                <div
                  key={i}
                  className={`w-full cursor-pointer hover:opacity-60 ${
                    selectedCategories.some(selected => selected.id === category.id) ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => handleIndustryClick(category)}
                >
                  <p className="text-[14px]">{category.name}</p>
                </div>
              ))}
          </div>
        </PlannerModal>
      ) : (
        <Drawer onClose={onClose} closable={false} open={open} placement="bottom" height="90vh">
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col items-center justify-center !p-0">
              <TextComponent as="h1" className="text-[16px] font-semibold leading-[32px] text-[#000000]">
                Industry
              </TextComponent>
            </div>

            <span
              className="cursor-pointer"
              onClick={() => {
                onClose()
              }}
            >
              <Icon icon={'mdi:close'} className="text-[24px]" />
            </span>
          </div>
          <div className="my-6 w-full">
            <TextInput
              placeholder="Search industry..."
              onChange={e => setSearch(e.target.value)}
              name={'industrySearch'}
              value={search}
              type={'text'}
            />
          </div>
          <div className="mt-4 flex flex-col items-start gap-2 px-[10px] lg:px-[24px]">
            {industries?.data
              .filter((category: {name: string}) => category.name.toLowerCase().includes(search.toLowerCase()))
              .map((category: ISelectedIndustry, i: React.Key | null | undefined) => (
                <div
                  key={i}
                  className={`w-full cursor-pointer hover:opacity-60 ${
                    selectedCategories.some(selected => selected.id === category.id) ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => handleIndustryClick(category)}
                >
                  <p className="text-[14px]">{category.name}</p>
                </div>
              ))}
          </div>
        </Drawer>
      )}
    </section>
  )
}

export default AllIndustry
