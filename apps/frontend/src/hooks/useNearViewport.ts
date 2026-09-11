import {useEffect, useRef, useState} from 'react'

/**
 * Custom hook that detects when an element is approaching the viewport
 * @param rootMargin Distance from the viewport to trigger (default: "200px")
 * @param threshold Visibility threshold to trigger (default: 0)
 * @param forceLoad Force the element to be considered near the viewport (default: false)
 * @returns An object with the ref to attach to your component and a boolean indicating if it's near
 */
const useNearViewport = (rootMargin = '200px', threshold = 0, forceLoad = false) => {
  const [isNear, setIsNear] = useState(forceLoad)
  const [hasTriggered, setHasTriggered] = useState(forceLoad)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // If forceLoad is true, we don't need to observe
    if (forceLoad) {
      setIsNear(true)
      setHasTriggered(true)
      return
    }

    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      entries => {
        // If the element is intersecting or will soon intersect the viewport
        if (entries[0].isIntersecting && !hasTriggered) {
          setIsNear(true)
          setHasTriggered(true) // Only trigger once
        }
      },
      {
        rootMargin, // Load data when element is X distance from viewport
        threshold
      }
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [rootMargin, threshold, hasTriggered, forceLoad])

  return {ref, isNear, hasTriggered}
}

export default useNearViewport
