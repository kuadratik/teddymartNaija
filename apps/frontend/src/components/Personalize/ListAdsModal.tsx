import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'

interface IProps {
  setSellProductModal: React.Dispatch<React.SetStateAction<boolean>>
  setListBusinessModal: React.Dispatch<React.SetStateAction<boolean>>
  setLisAdsModal: React.Dispatch<React.SetStateAction<boolean>>
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  whatTodoModal: boolean
  setWhatTodoModal: React.Dispatch<React.SetStateAction<boolean>>
  data: any
}

const ListAdsModal = ({
  setModalOpen,
  setWhatTodoModal,
  whatTodoModal,
  setSellProductModal,
  setListBusinessModal,
  setLisAdsModal,
  data
}: IProps) => {
  console.log('🚀 ~ data:', data)
  const router = useRouter()
  const closeAllModal = () => {
    setModalOpen(false)
    setWhatTodoModal(false)
    setSellProductModal(false)
    setListBusinessModal(false)
    setLisAdsModal(false)
  }
  const storeOptions = [
    {
      id: 2,
      color: '#FF2D55'
    },
    {
      id: 3,
      color: '#AF52DE'
    },
    {
      id: 4,
      color: '#00C7BE'
    }
  ]
  const productList = [
    {
      id: 1,
      name: 'Create New',
      onclick: () => {
        closeAllModal()
        router.push('/post-ad')
      },
      icon: 'noto:megaphone'
    },
    // Only include actual stores, no fallbacks
    ...(Array.isArray(data) ? data : [])
      .slice(0, 3) // Limit to 3 stores
      .map((store: any, index: number) => {
        const option = storeOptions[index]
        return store
          ? {
              id: option?.id,
              name: store?.title,
              onclick: () => {
                closeAllModal()
                router.push(`/ads-gallery/${store?.id}`)
              },
              icon: '',
              color: option?.color
            }
          : null
      })
      .filter(Boolean) // Remove null entries
  ]
  return (
    <div className="mx-auto w-full p-6 shadow-f2 *:relative">
      <div className="flex h-full flex-col items-center justify-center rounded-lg">
        <div className="flex w-full items-center justify-between gap-2">
          <Icon
            onClick={() => {
              setLisAdsModal(false)
              setWhatTodoModal(true)
            }}
            icon={'fluent:chevron-left-16-filled'}
            className="w-[10%] cursor-pointer text-lg hover:opacity-50"
          />
          <h2 className="w-[80%] text-center text-lg font-bold">Create A Quick Ad</h2>
          <div className="w-[10%]"></div>
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-6">
          {productList.map((item: any, index) => (
            <div
              role="button"
              onClick={item.onclick}
              key={index}
              className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-[#F5F5F5] py-5 text-center font-[500] shadow-f2 transition-all delay-75 duration-75 hover:border-black hover:opacity-70"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                {item.icon ? (
                  <div className="relative text-[#000]">
                    <Icon icon={item.icon} className="h-[40px] w-[40px]" />
                    <Icon
                      icon="stash:plus-solid"
                      className="absolute -right-4 -top-2 h-[24px] w-[24px] text-gray-500"
                    />
                  </div>
                ) : (
                  <div
                    className="h-[42px] w-[42px] rounded-lg shadow-f2"
                    style={{
                      background: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                )}

                <span className="h-[2px] w-[30px] rounded-lg bg-[#858585] blur-sm" />
                <span className="text-sm font-[500] text-black">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ListAdsModal
