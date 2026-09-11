import {useChangePasswordMutation} from '@/services/Profile'
import {useRouter} from 'next/router'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {useGetAllWishlistsQuery} from '@/services/clips'

const useWishlist = () => {
  const router = useRouter()

  const {data: wishListData, isLoading: isWishListLoading} = useGetAllWishlistsQuery({})
  //   const [changeVendorPassword, {isLoading}] = useChangePasswordMutation()
  //   const changeVendorPasswordHandler = async (payload: VendorPasswordType, resetForm?: VoidFunction) => {
  //     try {
  //       await changeVendorPassword(payload)
  //         .unwrap()
  //         .then(res => {
  //           showPlannerToast({
  //             options: {
  //               customToast: (
  //                 <CustomToast
  //                   altText={''}
  //                   title={<>Password Changed Successfully</>}
  //                   textColor="#FFF"
  //                   message={''}
  //                   backgroundColor="#000"
  //                 />
  //               )
  //             },
  //             message: 'message'
  //           })
  //           resetForm && resetForm()
  //           // router.push('/vendor/profile')
  //         })
  //     } catch (err) {
  //       console.log(err, 'Error updating vendor password')
  //     }
  //   }

  return {wishListData, isWishListLoading}
}

export default useWishlist
