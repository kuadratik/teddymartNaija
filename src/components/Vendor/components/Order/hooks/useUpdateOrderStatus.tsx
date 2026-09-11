import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useUpdateOrderStatusMutation} from '@/services/vendor/vendor'
import {useRouter} from 'next/router'

const useUpdateOrderStatus = () => {
  const router = useRouter()

  const [updateOrderStatus, {isLoading}] = useUpdateOrderStatusMutation()
  const updateOrderStatusHandler = async ({
    userStore,
    status,
    order_id
  }: {
    userStore: string
    status: any
    order_id: any
  }) => {
    try {
      await updateOrderStatus({
        userStore,
        status,
        order_id
      })
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Order Status Updated</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          // router.push('/vendor/profile')
        })
    } catch (err: any) {
      console.log(err, 'Error updating vendor profile')
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={err?.data?.message || <>Order Status Update Failed</>}
              textColor="#FFF"
              message={''}
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }

  return {updateOrderStatusHandler, isLoading}
}

export default useUpdateOrderStatus
