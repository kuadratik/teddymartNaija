import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useCreateStartConversationMutation} from '@/services/messaging'
import {useRouter} from 'next/router'

const useStartConversation = (closeModal?: VoidFunction) => {
  const [createStartConversation, {isLoading: isLoadingStartConversation, error, isSuccess}] =
    useCreateStartConversationMutation()
  const router = useRouter()
  const startConversation = async ({
    body,
    convoRoute,
    isRedirect = true
  }: {
    body: {user_id: string; message: string; advert_id: string; listing_id: string}
    convoRoute?: string
    isRedirect?: boolean
  }) => {
    try {
      await createStartConversation({
        body,
        convoRoute
      }).unwrap()
      closeModal && closeModal()
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={'Message Sent Successfully!'}
              textColor="#FFF"
              message="Message Sent Successfully"
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
      if (isRedirect) {
        router.push(`/messages`)
      }
    } catch (err: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText=""
              title={<>Error starting a conversation</>}
              textColor="#FFF"
              message=""
              backgroundColor="#000"
            />
          )
        },
        message: 'message'
      })
    }
  }
  return {isLoadingStartConversation, startConversation, error, isSuccess}
}

export default useStartConversation
