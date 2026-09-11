import {useAppSelector} from '@/hooks/reduxHooks'
import {Button} from 'antd'
import {useRouter} from 'next/router'

const AdsBanner = () => {
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuth = isAuthenticatedToken
  const router = useRouter()
  return (
    <div className="lg:mt-[40px]">
      <div className="flex h-[470px] w-full flex-row gap-4 lg:h-[570px]">
        <div className="h-full w-full bg-[url('/assets/ads_img.jpeg')] bg-cover bg-center lg:rounded-[8px]">
          <div className="px-8 py-4 lg:p-12">
            <h3 className="pb-5 text-[26px] font-semibold text-black">Advertise an item</h3>
            <Button
              onClick={() => {
                router.push('/post-ad')
              }}
              style={{
                backgroundColor: '#fff',
                color: 'black',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              htmlType="button"
              className="whitespace-nowrap rounded-lg bg-[#fff] px-4 py-[20px] font-bold text-gray-800"
            >
              Post Ad
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdsBanner
