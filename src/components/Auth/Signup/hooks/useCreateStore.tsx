import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import { showPlannerToast } from '@/components/SharedUI/Toast/plannerToast'
import { setActiveStore } from '@/redux/apiSlice/authSlice'
import { setType } from '@/redux/apiSlice/vendorSlice'
import { useCreateStoreMutation } from '@/services/vendor/vendor'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { OnboardingType } from '../utils'

const useCreateStoreQuery = ({
  setFieldError,
  setCurrentForm,
  values,
  redirectToDashboard = true
}: {
  setFieldError: any
  setCurrentForm: any
  values: any
  redirectToDashboard?: boolean
}) => {
  const [createStore, { isLoading }] = useCreateStoreMutation()
  const router = useRouter()
  const dispatch = useDispatch()
  const handleCreateStore = async ({ payload }: { payload: OnboardingType }) => {
    try {
      await createStore({ body: payload })
        .unwrap()
        .then((res: any) => {
          dispatch(setActiveStore({ activeUser: res?.data?.store }))

          if (values.type === 'product') {
            dispatch(setType({ type: 'product' }))
          } else if (values.type === 'service') {
            dispatch(setType({ type: 'service' }))
          }
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Store Created Successfully</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })

          if (redirectToDashboard) {
            setTimeout(() => {
              router.push('/vendor/dashboard')
            }, 1000)
          } else {
            // Proceed to next step
            setTimeout(() => {
              setCurrentForm((prev: number) => prev + 1)
            }, 1000)
          }
        })
    } catch (err: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast altText={''} title={err?.data?.message} textColor="#FFF" message={''} backgroundColor="#000" />
          )
        },
        message: 'message'
      })

      if (err?.data?.errors?.address2 && err?.data?.errors?.address2[0].includes('The address2 field is required.')) {
        setFieldError('address2', 'Required')
        setCurrentForm(1)
      }
      if (err?.data?.errors?.address1 && err?.data?.errors?.address1[0].includes('The address1 field is required.')) {
        setFieldError('address1', 'Required')
        setCurrentForm(1)
      }
      if (
        err?.data?.errors?.postal_code &&
        err?.data?.errors?.postal_code[0].includes('The postal code field is required.')
      ) {
        setFieldError('postal_code', 'Required')
        setCurrentForm(1)
      }
      if (err?.data?.errors?.name && err?.data?.errors?.name[0].includes('taken')) {
        setFieldError('name', 'Store name is taken')
        setCurrentForm(1)
      }
    }
  }
  return { isLoading, handleCreateStore }
}

export default useCreateStoreQuery
