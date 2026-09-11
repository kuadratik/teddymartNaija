import { useEffect, useState } from 'react'

/**
 * Custom hook to detect network status.
 *
 * @returns {boolean} - Indicates whether the user is online or offline.
 */
const useNetworkStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true)

  /**
   * Updates the network status.
   */
  const updateNetworkStatus = (): void => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }
  }

  /**
   * Adds event listeners to detect network status changes.
   */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', updateNetworkStatus)
      window.addEventListener('offline', updateNetworkStatus)

      // Cleanup event listeners on component unmount
      return () => {
        window.removeEventListener('online', updateNetworkStatus)
        window.removeEventListener('offline', updateNetworkStatus)
      }
    }
  }, [])

  return isOnline
}

export default useNetworkStatus
