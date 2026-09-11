import Image from 'next/image'
import placeholder from '../../public/assets/admission/placeholder.png'
// import {IApplicationDetailsTopLevel} from '@/types/forms'

interface IProps {
  sideTabsData: any
  selectedTab: any
  setSelectedTab: any
  data: any
}

export const SideTabsBlock = ({selectedTab, setSelectedTab, sideTabsData, data}: IProps) => {
  // console.log('Data in tabs ', selectedTab)

  return (
    <div className="hidden h-[1200px] overflow-auto rounded-[8px] bg-white md:block md:w-[30%]">
      <div className="flex flex-col items-center gap-4 py-4">
        {data?.data.responses.map((item: any, index: number) => {
          // Check if the item is an array, if so, pick the first object in the array
          const responseItem = Array.isArray(item) ? item[0] : item
          return (
            <div
              key={responseItem.id}
              className={`${responseItem.id === (Array.isArray(selectedTab) ? selectedTab[0].id : selectedTab?.id) ? 'border-[#0077B5]' : 'border-[#F5F5F5]'} h-[256px] w-[244px] cursor-pointer rounded-[18px] border-2 bg-[#F5F5F5] p-0`}
              onClick={() => {
                setSelectedTab(item)
              }}
            >
              <div className="mx-auto mt-3 h-[80%] w-[90%] bg-white">
                <Image src={placeholder} alt="placeholder" className="cover" />
              </div>
              <p
                className={`mt-1 whitespace-nowrap text-center text-sm font-medium leading-[24px] ${responseItem.id === (Array.isArray(selectedTab) ? selectedTab[0].id : selectedTab?.id) ? 'text-school' : 'text-[#828893]'}`}
              >
                Page {index + 1}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const SideTabsBlockMoble = ({selectedTab, setSelectedTab, sideTabsData, data}: IProps) => {
  // console.log('Data in tabs ', selectedTab)

  return (
    <div className="flex h-auto overflow-auto rounded-[8px] bg-white md:hidden md:w-[30%]">
      <div className="flex items-center gap-2 pb-2 md:gap-4 md:py-4">
        {data?.data.responses.map((item: any, index: number) => {
          const responseItem = Array.isArray(item) ? item[0] : item
          return (
            <div
              key={responseItem.id}
              className={`${responseItem.id === (Array.isArray(selectedTab) ? selectedTab[0].id : selectedTab?.id) ? 'border-[#0077B5]' : 'border-[#F5F5F5]'} cursor-pointer rounded-lg border-2 bg-[#F5F5F5] px-1`}
              onClick={() => {
                setSelectedTab(item)
              }}
            >
              <div className="mx-auto mt-3 h-[80%] w-[90%] bg-white">
                <Image src={placeholder} alt="placeholder" className="cover" />
              </div>
              <p
                className={`mt-1 whitespace-nowrap text-center text-sm font-medium leading-[24px] ${responseItem.id === (Array.isArray(selectedTab) ? selectedTab[0].id : selectedTab?.id) ? 'text-school' : 'text-[#828893]'}`}
              >
                Page {index + 1}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
