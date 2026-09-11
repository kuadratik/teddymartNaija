import {Icon} from '@iconify/react'
import {Tooltip} from 'antd'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

// Add a hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

interface IProps {
  setSellProductModal: React.Dispatch<React.SetStateAction<boolean>>
  setLisAdsModal: React.Dispatch<React.SetStateAction<boolean>>
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  whatTodoModal: boolean
  setWhatTodoModal: React.Dispatch<React.SetStateAction<boolean>>
}

const WhatToDoInEki = ({
  setModalOpen,
  setWhatTodoModal,
  whatTodoModal,
  setSellProductModal,
  setLisAdsModal
}: IProps) => {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null)
  const closeAllModal = () => {
    setModalOpen(false)
    setWhatTodoModal(false)
    setSellProductModal(false)
    setLisAdsModal(false)
  }

  const productList = [
    {
      name: 'Buy Something',
      onclick: () => {
        closeAllModal()
        router.push('/')
      },
      icon: 'noto:shopping-bags',
      tooltip: 'Discover amazing deals from trusted vendors near you.'
    },
    {
      name: 'Sell Products',
      onclick: () => {
        closeAllModal()
        setSellProductModal(true)
      },
      icon: 'flat-color-icons:shop',
      tooltip: 'Start selling today, retail or wholesale – fast, easy, and secure.'
    },
    {
      name: 'Create a Quick Ad',
      onclick: () => {
        closeAllModal()
        setLisAdsModal(true)
      },
      icon: 'noto:megaphone',
      tooltip: 'Got something to promote? Post it in 60 seconds.'
    }
  ]
  return (
    <div className="mx-auto w-full p-6 shadow-f2 *:relative">
      <div className="flex h-full flex-col items-center justify-center rounded-lg">
        <div className="flex w-full items-center justify-between gap-2">
          <Icon
            onClick={() => {
              setWhatTodoModal(false)
              setModalOpen(true)
            }}
            icon={'fluent:chevron-left-16-filled'}
            className="w-[10%] cursor-pointer text-lg hover:opacity-50"
          />
          <h2 className="w-[80%] text-center text-lg font-bold">Welcome to AfricanDiasporaMart</h2>
          <div className="w-[10%]"></div>
        </div>
        <h4 className="pt-3 text-center text-[14px] font-[500]">What do you want to do today on AfricanDiasporaMart?</h4>

        <div className="mt-6 grid w-full grid-cols-2 gap-6">
          {productList.map((item, index) => (
            <div key={index} className="relative">
              {isMobile ? (
                // Mobile-specific implementation
                <div
                  role="button"
                  onClick={() => {
                    if (activeTooltip === index) {
                      // Second tap - execute action
                      setActiveTooltip(null)
                      item.onclick()
                    } else {
                      // First tap - show tooltip
                      setActiveTooltip(index)
                    }
                  }}
                  className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-[#F5F5F5] py-5 text-center font-[500] shadow-f2 transition-all delay-75 duration-75 hover:border-black hover:opacity-70"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="text-[#000]">
                      <Icon icon={item.icon} className="h-[40px] w-[40px]" />
                    </div>
                    <span className="h-[2px] w-[30px] rounded-lg bg-[#858585] blur-sm" />
                    <span className="text-sm font-[500] text-black">{item.name}</span>
                    <span className="mt-1 text-xs text-gray-500">(Tap for info)</span>
                  </div>

                  {/* Custom mobile tooltip */}
                  {activeTooltip === index && (
                    <div className="absolute -top-16 left-0 right-0 mx-auto w-[95%] rounded-md bg-black p-3 text-white shadow-lg">
                      <p className="text-xs">{item.tooltip}</p>
                      <p className="mt-2 text-xs font-semibold">Tap again to continue</p>
                      <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-black"></div>
                    </div>
                  )}
                </div>
              ) : (
                // Desktop implementation with hover tooltip
                <Tooltip
                  title={item.tooltip}
                  placement="top"
                  color="#000"
                  overlayInnerStyle={{color: '#fff', fontSize: '12px'}}
                  overlayStyle={{borderRadius: '8px'}}
                  arrow={{pointAtCenter: true}}
                  autoAdjustOverflow={false}
                  destroyTooltipOnHide={true}
                  getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                >
                  <div
                    role="button"
                    onClick={item.onclick}
                    className="flex w-full cursor-pointer items-center justify-center rounded-lg border bg-[#F5F5F5] py-5 text-center font-[500] shadow-f2 transition-all delay-75 duration-75 hover:border-black hover:opacity-70"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="text-[#000]">
                        <Icon icon={item.icon} className="h-[40px] w-[40px]" />
                      </div>
                      <span className="h-[2px] w-[30px] rounded-lg bg-[#858585] blur-sm" />
                      <span className="text-sm font-[500] text-black">{item.name}</span>
                    </div>
                  </div>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WhatToDoInEki
