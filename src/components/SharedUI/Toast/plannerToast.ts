import { toast } from 'react-toastify'

interface ToastOptions {
  customToast?: React.ReactNode
  [key: string]: any // Allow additional custom options
}

interface ShowToastParams {
  message: string
  options?: ToastOptions
}

const defaultOptions = {
  position: 'top-right',
  autoClose: 10000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  style: {
    backgroundColor: '#FCFCFD',
    color: '#fff',
    boxShadow: '0px 4px 6px rgba(50, 50, 71, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.08)',
    innerWidth: '100%',
    outerWidth: '100%',
    width: '100%'
  }
}

export const showPlannerToast = ({ message, options = {} }: ShowToastParams): void => {
  const { customToast, ...overrideOptions } = options

  if (!message) {
    console.error('Error: Toast message is required.')
    return
  }

  const mergedOptions: any = { ...defaultOptions, ...overrideOptions }

  if (customToast) {
    toast(customToast, mergedOptions)
  } else {
    toast(message, mergedOptions)
  }
}
