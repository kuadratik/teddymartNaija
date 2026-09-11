import {useAppSelector} from '@/hooks/reduxHooks'
import {setActiveStore} from '@/redux/apiSlice/authSlice' // Import the action
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {useDispatch} from 'react-redux' // Import useDispatch

interface IProps {
  setSellProductModal: React.Dispatch<React.SetStateAction<boolean>>
  setListBusinessModal: React.Dispatch<React.SetStateAction<boolean>>
  setLisAdsModal: React.Dispatch<React.SetStateAction<boolean>>
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  whatTodoModal: boolean
  setWhatTodoModal: React.Dispatch<React.SetStateAction<boolean>>
}

const SellProductModal = ({
  setModalOpen,
  setWhatTodoModal,
  whatTodoModal,
  setSellProductModal,
  setListBusinessModal,
  setLisAdsModal
}: IProps) => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user)
  const router = useRouter()
  const dispatch = useDispatch() // Add dispatch

  // Get top 3 stores with highest view_count
  const userStores = isAuthenticatedUser?.store || []
  const topStores = [...userStores].sort((a, b) => b.views_count - a.views_count).slice(0, 3)

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
      defaultName: 'Sell Products',
      setModal: setSellProductModal,
      color: '#5856D6'
    },
    {
      id: 3,
      defaultName: 'List a Business',
      setModal: setListBusinessModal,
      color: '#2E00D7'
    },
    {
      id: 4,
      defaultName: 'Create a Quick Ad',
      setModal: setLisAdsModal,
      color: '#A2845E'
    }
  ]

  const productList = [
    {
      id: 1,
      name: 'Create New',
      onclick: () => {
        closeAllModal()
        router.push('/mek/onboarding')
      },
      icon: 'flat-color-icons:shop'
    },
    // Only include actual stores, no fallbacks
    ...(Array.isArray(topStores) ? topStores : [])
      .map((store, index) => {
        const option = storeOptions[index]
        return store
          ? {
              id: option.id,
              name: store.name,
              onclick: () => {
                closeAllModal()
                // Set this store as active and navigate to vendor dashboard
                dispatch(setActiveStore({activeUser: store}))
                router.push('/vendor/dashboard')
              },
              icon: '',
              color: option.color
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
              setSellProductModal(false)
              setWhatTodoModal(true)
            }}
            icon={'fluent:chevron-left-16-filled'}
            className="w-[10%] cursor-pointer text-lg hover:opacity-50"
          />
          <h2 className="w-[80%] text-center text-lg font-bold">Sell Product</h2>
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

export default SellProductModal
