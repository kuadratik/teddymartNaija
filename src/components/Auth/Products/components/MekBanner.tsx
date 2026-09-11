import {useAppSelector} from '@/hooks/reduxHooks'
import {Button} from 'antd'
import {useRouter} from 'next/router'

const MekBanner = () => {
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const isAuth = isAuthenticatedToken
  const router = useRouter()
  return (
    <div className="relative mx-auto hidden w-full max-w-7xl md:block">
      <div className="flex h-[450px] w-full lg:h-[450px]">
        <div className="h-full w-full bg-[url('/assets/lady-with-megaphone.png')] bg-cover bg-center bg-no-repeat lg:rounded-[8px]">
          <div className="absolute right-36 top-32">
            <h3 className="w-[350px] pb-5 text-[27px] font-semibold text-black">
              Build your brand’s reach with MEK Directory – get started today!
            </h3>
            <Button
              onClick={() => {
                router.push('/get-list')
              }}
              htmlType="button"
              className="cursor-pointer whitespace-nowrap rounded-lg bg-[#000] px-4 py-[20px] font-bold text-white"
            >
              Get Listed
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MekBanner
