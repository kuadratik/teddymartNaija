import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import { showPlannerToast } from '@/components/SharedUI/Toast/plannerToast'
import copyToClipboard from '@/utils/fx'
import {useCallback} from 'react'

interface ToastConfig {
  successTitle?: string
  errorTitle?: string
  successMessage?: string
  errorMessage?: string
}

export const useCopyToClipboard = () => {
  const handleCopy = useCallback(async (text: string, config?: ToastConfig) => {
    try {
      await copyToClipboard(text)
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>{config?.successTitle || 'Link Copied Successfully'}</>}
              image={'/assets/states/notificationToasts/successcheck.svg'}
              textColor="#fff"
              message={config?.successMessage || ''}
              backgroundColor="#000"
            />
          )
        },
        message: 'Copied'
      })
      return true
    } catch (error) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>{config?.errorTitle || 'Unable to copy!'}</>}
              image={'/assets/states/notificationToasts/error.svg'}
              textColor="red"
              message={config?.errorMessage || 'Unable to copy'}
              backgroundColor="#FCFCFD"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
      return false
    }
  }, [])

  return {handleCopy}
}
