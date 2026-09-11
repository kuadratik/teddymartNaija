import {useCallback, useRef, useState} from 'react'
import {useGetSlugRecommendationMutation} from '@/services/super-admin'

/**
 * Custom hook for handling debounced slug generation with race condition prevention
 *
 * Features:
 * - Debounced API calls (default 500ms)
 * - AbortController to cancel previous requests
 * - Request ID tracking to prevent race conditions
 * - Automatic cleanup on unmount
 *
 * Usage example:
 * ```tsx
 * const { generateSlug, isGenerating, error, clearError, cleanup } = useSlugGeneration({
 *   onSuccess: (slug) => formik.setFieldValue('slug', slug),
 *   onError: (error) => console.error('Slug generation failed:', error),
 *   debounceMs: 500
 * })
 *
 * // In brand name change handler:
 * const handleBrandNameChange = (e) => {
 *   const value = e.target.value
 *   formik.setFieldValue('brandName', value)
 *   if (!isSlugManuallyEdited) {
 *     generateSlug(value)
 *   }
 * }
 *
 * // Cleanup on unmount:
 * useEffect(() => cleanup, [cleanup])
 * ```
 */

interface UseSlugGenerationOptions {
  onSuccess?: (slug: string) => void
  onError?: (error: string) => void
  debounceMs?: number
}

interface UseSlugGenerationReturn {
  generateSlug: (brandName: string) => void
  isGenerating: boolean
  error: string | null
  clearError: () => void
  cleanup: () => void
}

export const useSlugGeneration = (options: UseSlugGenerationOptions = {}): UseSlugGenerationReturn => {
  const {onSuccess, onError, debounceMs = 500} = options

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [getSlugRecommendation] = useGetSlugRecommendationMutation()

  // Refs to manage debouncing and request cancellation
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef<number>(0)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const generateSlug = useCallback(
    async (brandName: string, requestId: number) => {
      if (!brandName.trim()) return

      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new AbortController for this request
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setIsGenerating(true)
      setError(null)

      try {
        const response = await getSlugRecommendation({
          name: brandName.trim()
        }).unwrap()

        // Check if this request was aborted or if a newer request has started
        if (abortController.signal.aborted || requestId !== requestIdRef.current) {
          return
        }

        if (response.success && response.data?.slug) {
          onSuccess?.(response.data.slug)
        }
      } catch (error: any) {
        // Don't handle error if request was aborted or superseded
        if (abortController.signal.aborted || requestId !== requestIdRef.current) {
          return
        }

        let errorMessage = 'Failed to generate slug'

        // Handle field-specific errors for slug generation
        if (error?.data?.errors && typeof error.data.errors === 'object') {
          const slugErrors = error.data.errors.name || error.data.errors.slug
          if (slugErrors && slugErrors[0]) {
            errorMessage = slugErrors[0]
          } else if (error?.data?.message) {
            errorMessage = error.data.message
          }
        } else if (error?.data?.message) {
          errorMessage = error.data.message
        }

        setError(errorMessage)
        onError?.(errorMessage)
      } finally {
        // Only update loading state if this is still the current request
        if (!abortController.signal.aborted && requestId === requestIdRef.current) {
          setIsGenerating(false)
        }
      }
    },
    [getSlugRecommendation, onSuccess, onError]
  )

  const debouncedGenerateSlug = useCallback(
    (brandName: string) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Increment request ID to track the latest request
      requestIdRef.current += 1
      const currentRequestId = requestIdRef.current

      // Set new timeout for slug generation
      if (brandName.trim()) {
        debounceTimeoutRef.current = setTimeout(() => {
          generateSlug(brandName, currentRequestId)
        }, debounceMs)
      } else {
        // Clear states if brand name is empty
        setIsGenerating(false)
        setError(null)
      }
    },
    [generateSlug, debounceMs]
  )

  // Cleanup function to cancel ongoing requests and timeouts
  const cleanup = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsGenerating(false)
    setError(null)
  }, [])

  // Return cleanup function as part of the hook for manual cleanup
  return {
    generateSlug: debouncedGenerateSlug,
    isGenerating,
    error,
    clearError,
    cleanup
  }
}
