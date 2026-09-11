import {useAppDispatch} from '@/hooks/reduxHooks'
import {setActiveStore} from '@/redux/apiSlice/authSlice'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useRouter} from 'next/router'
import {useState} from 'react'

export const useStoreSwitch = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [dropDown, setDropDown] = useState(false)

  const handleStoreSwitch = (value: any) => {
    console.log('value', value)
    dispatch(setType({type: value?.type === 'product' ? 'product' : 'service'}))
    dispatch(setActiveStore({activeUser: value}))
    setDropDown(false)
    router.push('/vendor/dashboard')
  }

  return {handleStoreSwitch, dropDown, setDropDown}
}
