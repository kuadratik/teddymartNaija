import {useAppSelector} from '@/hooks/reduxHooks'
import {setActiveStore} from '@/redux/apiSlice/authSlice' // Import the action
import {useGetUserStoreQuery} from '@/services/store'
import {IUserStoreDatum} from '@/types/userStore'
import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {useDispatch} from 'react-redux' // Import useDispatch
// Skeleton loader component mimicking the card UI
const SkeletonCard = () => (
  <div className="relative flex w-full animate-pulse cursor-pointer items-center justify-center rounded-lg border bg-[#F5F5F5] py-5 text-center font-[500] shadow-f2">
    {/* Skeleton Status Badge */}
    <div className="absolute right-2 top-2">
      <div className="flex items-center gap-1.5 rounded-full bg-gray-200 px-2.5 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
        <span className="h-3 w-8 rounded bg-gray-300 text-[10px] font-semibold"></span>
      </div>
    </div>

    {/* Skeleton Card Content */}
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="h-[42px] w-[42px] rounded-lg bg-gray-300 shadow-f2"></div>
      <span className="h-[2px] w-[30px] rounded-lg bg-gray-300"></span>
      <span className="h-4 w-16 rounded bg-gray-300 text-sm font-[500]"></span>
    </div>
  </div>
)
interface IProps {
  setSellProductModal: React.Dispatch<React.SetStateAction<boolean>>
  setLisAdsModal: React.Dispatch<React.SetStateAction<boolean>>
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  whatTodoModal: boolean
  setWhatTodoModal: React.Dispatch<React.SetStateAction<boolean>>
  sellProductModal: boolean
}

const SellProductModal = ({
  setModalOpen,
  setWhatTodoModal,
  whatTodoModal,
  setSellProductModal,
  setLisAdsModal,
  sellProductModal
}: IProps) => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user)
  const router = useRouter()
  const dispatch = useDispatch() // Add dispatch
  const {selectedLanguage} = useAppSelector(state => state.country)
  const {
    data: userStoreData,
    isLoading: userStoreLoading,
    refetch,
    isFetching
  } = useGetUserStoreQuery({currency: selectedLanguage.value})
  const allUserStores = userStoreData?.data || []
  const userStores = allUserStores || []

  // Separate stores by active status
  const inactiveStores = userStores.filter(store => store.active === 0 && store?.payment_status !== 'success')
  const activeStores = userStores.filter(store => store.active !== 0 || store?.payment_status === 'success')

  // Start with inactive stores (prioritized)
  let topStores = [...inactiveStores]

  // If we need more stores to reach 3, add active stores sorted by listing count
  if (topStores.length < 3) {
    const remainingCount = 3 - topStores.length
    const sortedActiveStores = [...activeStores].sort((a, b) => (b.listings_count || 0) - (a.listings_count || 0))
    topStores = [...topStores, ...sortedActiveStores.slice(0, remainingCount)]
  }

  // Helper function to get store status
  const getStoreStatus = (store: IUserStoreDatum) => {
    if (store.active === 0 && store?.payment_status !== 'success') {
      return {
        label: 'Inactive',
        color: 'red', // or whatever color scheme you use
        variant: 'danger' // adjust based on your UI framework
      }
    }
    return {
      label: 'Active',
      color: 'green',
      variant: 'success'
    }
  }

  // Usage example:
  // const status = getStoreStatus(store)
  // <Badge variant={status.variant}>{status.label}</Badge>

  const closeAllModal = () => {
    setModalOpen(false)
    setWhatTodoModal(false)
    setSellProductModal(false)
    setLisAdsModal(false)
  }

  useEffect(() => {
    if (sellProductModal) {
      refetch()
    }
  }, [sellProductModal, refetch])
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
              status: getStoreStatus(store),
              onclick: () => {
                closeAllModal()
                // Set this store as active and navigate to vendor dashboard
                dispatch(setActiveStore({activeUser: store}))
                if (store.active === 0 && store?.payment_status !== 'success') {
                  router.push(`/mek/onboarding?store_id=${store.id}`)
                  return
                } else if (store.listings_count === 0) {
                  router.push('/vendor/products?tab=all')
                } else {
                  router.push('/vendor/dashboard')
                }
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
        {userStoreLoading || isFetching ? (
          <div className="mt-6 grid w-full grid-cols-2 gap-6">
            {Array.from({length: 4}).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid w-full grid-cols-2 gap-6">
            {productList.map((item: any, index) => {
              return (
                <div
                  role="button"
                  onClick={item.onclick}
                  key={index}
                  className="relative flex w-full cursor-pointer items-center justify-center rounded-lg border bg-[#F5F5F5] py-5 text-center font-[500] shadow-f2 transition-all delay-75 duration-75 hover:border-black hover:opacity-70"
                >
                  {/* Status Badge - Top Right Corner */}
                  {item.status && (
                    <div className="absolute right-2 top-2">
                      <div
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-md ${
                          item.status.variant === 'danger'
                            ? 'border border-red-200 bg-red-100 text-red-700'
                            : item.status.variant === 'success'
                              ? 'border border-green-200 bg-green-100 text-green-700'
                              : 'border border-gray-200 bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 animate-pulse rounded-full ${
                            item.status.variant === 'danger'
                              ? 'bg-red-500'
                              : item.status.variant === 'success'
                                ? 'bg-green-500'
                                : 'bg-gray-500'
                          }`}
                        />
                        <span>{item.status.label.toLowerCase() === 'active' ? 'Paid' : 'Unpaid'}</span>
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellProductModal
