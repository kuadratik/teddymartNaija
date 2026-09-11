import {useSignUpMutation} from '@/services/auth'
import {useCreateStoreMutation} from '@/services/vendor/vendor'
import {SignUpRequestModel} from '@/types/types'
import {useRouter} from 'next/router'
import {useLocalStorage} from 'react-use'
import {OnboardingType} from '../utils'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useDispatch} from 'react-redux'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'

const useCreateStoreQuery = ({
  setFieldError,
  setCurrentForm,
  values
}: {
  setFieldError: any
  setCurrentForm: any
  values: any
}) => {
  const [createStore, {isLoading}] = useCreateStoreMutation()
  const router = useRouter()
  const dispatch = useDispatch()
  const handleCreateStore = async ({payload}: {payload: OnboardingType}) => {
    try {
      await createStore({body: payload})
        .unwrap()
        .then((res: any) => {
          if (values.offers_product) {
            dispatch(setType({type: 'product'}))
          } else if (values.offers_service) {
            dispatch(setType({type: 'service'}))
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

          setTimeout(() => {
            router.push('/vendor/dashboard')
          }, 0)
        })
    } catch (err: any) {
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
  return {isLoading, handleCreateStore}
}

export default useCreateStoreQuery
