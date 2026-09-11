import {useChangePasswordMutation} from '@/services/Profile'
import {VendorPasswordType} from '../utils'
import {useRouter} from 'next/router'

const useChangeVendorPassword = () => {
  const router = useRouter()

  const [changeVendorPassword, {isLoading}] = useChangePasswordMutation()
  const changeVendorPasswordHandler = async (payload: VendorPasswordType) => {
    try {
      await changeVendorPassword(payload)
        .unwrap()
        .then(res => {
          router.push('/vendor/profile')
        })
    } catch (err) {
      console.log(err, 'Error updating vendor password')
    }
  }

  return {changeVendorPasswordHandler, isLoading}
}

export default useChangeVendorPassword
