import {useAppSelector} from '@/hooks/reduxHooks'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetAllClipsQuery} from '@/services/auth/clips'
import {Icon} from '@iconify/react'
import {Badge, Button} from 'antd'
import {useRouter} from 'next/router'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

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
