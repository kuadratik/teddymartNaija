import CustomButton from '@/components/SharedUI/Buttons/Button'
import TextInput from '@/components/SharedUI/Input/TextInput'
import LogoHeader from '@/components/SharedUI/LogoHeader'
import NavTabs from '@/components/SharedUI/NavTabs'
import Link from 'next/link'
import {useRouter} from 'next/router'
import {useState} from 'react'
import Category from './components/Category'
import RecommendedComponent from './components/Recommend'
import {useActiveUserQuery} from '@/services/auth'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useDispatch, useSelector} from 'react-redux'
import {setCredentials} from '@/redux/apiSlice/authSlice'
import TextComponent from '@/components/SharedUI/TextComponent'
import {setType} from '@/redux/apiSlice/vendorSlice'

const tabItems = [
  {id: 'product', title: 'Product', link: ''},
  {id: 'service', title: 'Services', link: ''}
]

const LandingPage = () => {
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const isAuthenticatedToken = useAppSelector(state => state.auth.token) // get authenticated token
  const has_store = isAuthenticatedUser?.has_store

  const isAuth = isAuthenticatedToken

  const {type} = useSelector((state: any) => state.vendor)
  const dispatch = useDispatch()

  const handleChange = (value: 'product' | 'service') => {
    dispatch(setType({type: value}))
  }
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex w-full flex-col items-center justify-center gap-8">
        {isAuth && has_store ? (
          <div className="flex w-full items-center justify-between">
            <div>
              <LogoHeader />
            </div>

            <div
              role="button"
              className="flex h-[33px] w-[149px] cursor-pointer items-center justify-center rounded-[8px] bg-black"
              onClick={() => router.push('/vendor')}
            >
              <TextComponent as="p" className="text-[13px] font-medium leading-[15.23px] text-white">
                Switch to Vendor
              </TextComponent>
            </div>
          </div>
        ) : (
          <div className="flex">
            <LogoHeader />
          </div>
        )}

        {isAuth ? (
          <></>
        ) : (
          <div className="flex gap-3">
            <CustomButton
              onClick={() => {
                router.push('auth/sign-up')
              }}
              type="button"
              className="w-[100px] !border-[1px] !border-[#000000] bg-white px-1 py-2"
            >
              Sign Up
            </CustomButton>
            <CustomButton
              onClick={() => {
                router.push('auth/login')
              }}
              type="button"
              className="w-[100px] border-[1px] border-gray-300 bg-white px-2 py-1"
            >
              Login
            </CustomButton>
          </div>
        )}
        {!has_store && (
          <div className="flex gap-3">
            <div className="text-[14px] font-medium">
              <span className="font-medium text-[#6B7280]">To advertise a product or service, </span>
              <Link href={'/vendor/onboarding'} className="!border-none !p-0 text-sm text-[#000] underline">
                Click here
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <NavTabs backgroundColor="#F1F1F1" active={type} setActive={handleChange} naveItems={tabItems} />
      </div>
      <div className="w-full">
        <TextInput
          iconName="iconamoon:category"
          iconClick={() => {
            setOpen(true)
          }}
          placeholder="Search for a product or vendor"
          onChange={e => {
            setSearch(e.target.value)
          }}
          name={''}
          value={search}
          type={'text'}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              router.push('/search?id=' + search)
            }
          }}
        />
      </div>

      <div className="w-full">
        <Category open={open} setOpen={setOpen} />
      </div>

      <div className="w-full">
        <RecommendedComponent />
      </div>
    </div>
  )
}

export default LandingPage
