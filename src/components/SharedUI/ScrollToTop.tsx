import {Icon} from '@iconify/react'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
interface IProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}
const ScrollToTop = ({setModalOpen}: IProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const pathName = router.asPath

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {!pathName.includes('/auth') && (
        <button
          onClick={() => {
            setModalOpen(true)
          }}
          className={`fixed ${
            isVisible ? 'bottom-16' : 'bottom-4'
          } right-[15px] z-50 rounded-full bg-white p-2.5 text-white shadow-lg shadow-black transition-colors duration-300 hover:bg-gray-100 lg:right-4`}
          aria-label="Scroll to top"
        >
          <Icon icon="ic:round-live-help" className="h-6 w-6 text-[#34C759]" />
        </button>
      )}

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 z-50 rounded-full bg-gray-800 p-2 text-white shadow-lg transition-colors duration-300 hover:bg-gray-700"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  )
}

export default ScrollToTop
