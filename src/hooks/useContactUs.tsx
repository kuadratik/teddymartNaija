import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {useContactUsMutation} from '@/services/general/general'

const useContactUsQuery = () => {
  const [contactUs, {isLoading}] = useContactUsMutation()

  const contactUsHandler = async (payload: any, successFunc: VoidFunction) => {

    try {
      await contactUs({body: payload})
        .unwrap()
        .then(res => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>Thank you for reaching out! We'll be in touch with you shortly.</>}
                  textColor="#FFF"
                  message={''}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
      successFunc()

    } catch (err) {
      console.log(err, 'Error sending message')
    }
  }

  return {contactUsHandler, isLoading}
}

export default useContactUsQuery
