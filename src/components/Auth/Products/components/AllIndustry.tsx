import {Drawer} from 'antd'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {useGetAllIndustriesQuery} from '@/services/category/category'
import TextComponent from '@/components/SharedUI/TextComponent'
import TextInput from '@/components/SharedUI/Input/TextInput'
import React, {useState} from 'react'
import {Icon} from '@iconify/react'

export interface ISelectedIndustry {
  id: number
  name: string
}

interface IIndustryProps {
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedIndustry[]>>
}

const AllIndustry = ({open, setOpen, setSelectedCategories}: IIndustryProps) => {
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

  const {data: industries, isLoading: isLoadingIndustries} = useGetAllIndustriesQuery({})

  const onClose = () => {
    setOpen && setOpen(false)
  }

  return (
    <section className="w-full">
      {isDesktop ? (
        <PlannerModal modalOpen={open!} setModalOpen={setOpen!} onCloseModal={onClose}>
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
          {/* <div className="my-6 w-full">
            <TextInput
              placeholder="Search"
              onChange={e => setSearch(e.target.value)}
              name={''}
              value={search}
              type={'text'}
            />
          </div> */}
          <div className="mt-4 flex flex-col items-start gap-2 overflow-scroll px-[10px] lg:px-[24px]">
            {industries?.data
              .filter((category: {name: string}) => category.name.toLowerCase().includes(search.toLowerCase()))
              .map((category: ISelectedIndustry, i: React.Key | null | undefined) => (
                <div key={i} className="cursor-pointer" onClick={() => handleIndustryClick(category)}>
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
          {/* <div className="my-6 w-full">
            <TextInput
              placeholder="Search"
              onChange={e => setSearch(e.target.value)}
              name={''}
              value={search}
              type={'text'}
            />
          </div> */}
          <div className="mt-4 flex flex-col items-start gap-2 px-[10px] lg:px-[24px]">
            {industries?.data
              .filter((category: {name: string}) => category.name.toLowerCase().includes(search.toLowerCase()))
              .map((category: ISelectedIndustry, i: React.Key | null | undefined) => (
                <div key={i} className="cursor-pointer" onClick={() => handleIndustryClick(category)}>
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

// const AllIndustry = ({open, setOpen, setSelectedCategories}: IIndustryProps) => {
//   const isDesktop = useMediaQuery('(min-width: 1024px)')
//   const [search, setSearch] = useState('')

//   const handleIndustryClick = (category: ISelectedIndustry) => {
//     setSelectedCategories(prevSelected => {
//       const isAlreadySelected = prevSelected.some(selected => selected.id === category.id)

//       if (isAlreadySelected) {
//         return prevSelected.filter(selected => selected.id !== category.id)
//       } else {
//         return [...prevSelected, {id: category.id, name: category.name}]
//       }
//     })
//   }

//   const {data: industries, isLoading: isLoadingIndustries} = useGetAllIndustriesQuery({})

//   const onClose = () => {
//     setOpen && setOpen(false)
//   }

//   const filteredIndustries = industries?.data?.filter((category: {name: string}) =>
//     category.name.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <section className="w-full">
//       {isDesktop ? (
//         <PlannerModal modalOpen={open!} setModalOpen={setOpen!} onCloseModal={onClose}>
//           <div className="flex w-full flex-col items-center">
//             <TextComponent as="h1" className="text-[16px] font-semibold text-[#000000]">
//               Search by Industry
//             </TextComponent>
//           </div>
//           <div className="my-6 w-full">
//             <TextInput
//               placeholder="Search"
//               onChange={e => setSearch(e.target.value)}
//               name={''}
//               value={search}
//               type={'text'}
//             />
//           </div>
//           <div className="flex flex-col items-start gap-2 px-[10px] lg:px-[24px]">
//             {isLoadingIndustries ? (
//               <p>Loading industries...</p>
//             ) : filteredIndustries && filteredIndustries.length > 0 ? (
//               filteredIndustries.map((category: ISelectedIndustry, i: React.Key | null | undefined) => (
//                 <div key={i} className="cursor-pointer" onClick={() => handleIndustryClick(category)}>
//                   <p className="text-[14px]">{category.name}</p>
//                 </div>
//               ))
//             ) : (
//               <p>No industries found</p>
//             )}
//           </div>
//         </PlannerModal>
//       ) : (
//         <Drawer onClose={onClose} closable={false} open={open} placement="bottom" height="90vh">
//           <div className="flex w-full flex-col items-center">
//             <TextComponent as="h1" className="text-[16px] font-semibold text-[#000000]">
//               Search by Industry
//             </TextComponent>
//           </div>
//           <div className="my-6 w-full">
//             <TextInput
//               placeholder="Search"
//               onChange={e => setSearch(e.target.value)}
//               name={''}
//               value={search}
//               type={'text'}
//             />
//           </div>
//           <div className="flex flex-col items-start gap-2 px-[10px] lg:px-[24px]">
//             {isLoadingIndustries ? (
//               <p>Loading industries...</p>
//             ) : filteredIndustries && filteredIndustries.length > 0 ? (
//               filteredIndustries.map((category: ISelectedIndustry, i: React.Key | null | undefined) => (
//                 <div key={i} className="cursor-pointer" onClick={() => handleIndustryClick(category)}>
//                   <p className="text-[14px]">{category.name}</p>
//                 </div>
//               ))
//             ) : (
//               <p>No industries found</p>
//             )}
//           </div>
//         </Drawer>
//       )}
//     </section>
//   )
// }

// export default AllIndustry
