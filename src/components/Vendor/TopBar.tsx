import {useAppSelector} from '@/hooks/reduxHooks'
import {typeOptions} from '@/pages/vendor/dashboard'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {Icon} from '@iconify/react'
import {Badge, Button, Dropdown, Image, Menu} from 'antd'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import TextComponent from '../SharedUI/TextComponent'

interface ITopBarProps {
  title: string
  backFunction?: VoidFunction
  showClip?: boolean
  service_types?: boolean
}
const TopBar = ({title, backFunction, showClip, service_types = false}: ITopBarProps) => {
  const router = useRouter()
  const {selectedLanguage} = useAppSelector(state => state.country)
  const dispatch = useDispatch()

  const {type} = useSelector((state: any) => state.vendor)

  if (type === 'service') {
    showClip = false
  }

  const [dropDown, setDropDown] = useState(false)

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
    setDropDown(false)
  }
  const handleBack = () => {
    if (window.history.length > 2) {
      router.back()
    } else {
      // Navigate to home page when there's no history
      router.push('/')
    }
  }

  const {data, isLoading, isFetching} = useGetAllClipsQuery({
    currency: selectedLanguage.value
  })

  return (
    <div className="w-full lg:mt-10">
      <div className="flex w-full items-center">
        <Button
          className="mt-6 !border-none bg-transparent p-2 text-[14px] font-bold text-[#141414] lg:mt-0"
          onClick={backFunction ?? handleBack}
        >
          <Icon icon="ep:back" className={`text-2xl`} />
        </Button>
        {service_types ? (
          <>
            {' '}
            <div className="flex w-full items-center justify-center px-6 py-3">
              <Dropdown
                overlay={
                  <Menu className="flex flex-col gap-1">
                    {typeOptions.map((option, index) => (
                      <p
                        key={option.value}
                        onClick={() => {
                          handleChange(option.value)
                        }}
                        className="cursor-pointer rounded-lg p-2 visited:text-[#27104E] hover:bg-[#F5F4F5]"
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
                  <TextComponent as="span" className="text-[14px] font-medium capitalize leading-[17px]">
                    {type}
                  </TextComponent>{' '}
                  <Image src="/assets/downArrow.svg" preview={false} className="font-medium" />
                </div>
              </Dropdown>
            </div>
          </>
        ) : (
          <div className="mt-6 flex w-full flex-col items-center justify-center !p-0 lg:mt-0">
            {' '}
            <TextComponent as="h1" className="text-[16px] font-semibold leading-[32px] text-[#000000]">
              {title}
            </TextComponent>
          </div>
        )}

        {showClip && (
          <Button
            onClick={() => {
              router.push('/clips')
            }}
            type="text"
            className="flex-center hidden"
            size="large"
            icon={
              <Badge count={data?.data?.total_product_count} color="#000000">
                <Icon icon={'mdi-light:cart'} className="text-[28px]" />
              </Badge>
            }
          />
        )}
      </div>
    </div>
  )
}

export default TopBar
