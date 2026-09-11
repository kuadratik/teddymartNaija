# useSlugGeneration Hook

A custom React hook for handling debounced slug generation with race condition prevention.

## Features

- **Debounced API calls** (configurable, default 500ms)
- **AbortController** to cancel previous requests
- **Request ID tracking** to prevent race conditions
- **Automatic cleanup** on unmount
- **Error handling** with field-specific error messages

## Usage

### Basic Usage (AddBrandModal)

```tsx
import {useSlugGeneration} from '@/hooks/useSlugGeneration'

const {generateSlug, isGenerating, error, clearError, cleanup} = useSlugGeneration({
  onSuccess: (slug: string) => {
    if (!isSlugManuallyEdited) {
      formik.setFieldValue('slug', slug)
    }
  },
  onError: (error: string) => {
    // Error is handled by hook's internal state
  },
  debounceMs: 500
})

// Brand name change handler
const handleBrandNameChange = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    formik.setFieldValue('brandName', value)

    if (!isSlugManuallyEdited) {
      generateSlug(value)
    }
  },
  [formik, generateSlug, isSlugManuallyEdited]
)

// Cleanup on unmount
useEffect(() => {
  return () => {
    cleanup()
  }
}, [cleanup])
```

### Usage in EditBrandModal

```tsx
import { useSlugGeneration } from '@/hooks/useSlugGeneration'

const EditBrandModal = ({ brand, ... }) => {
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  const { generateSlug, isGenerating, error, clearError, cleanup } = useSlugGeneration({
    onSuccess: (slug: string) => {
      if (!isSlugManuallyEdited) {
        formik.setFieldValue('slug', slug)
      }
    },
    debounceMs: 500
  })

  // Initialize with existing brand data
  useEffect(() => {
    if (brand) {
      formik.setValues({
        brandName: brand.name,
        slug: extractSlugFromUrl(brand.target_url), // Extract slug from full URL
        // ... other fields
      })
    }
  }, [brand])

  const handleBrandNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    formik.setFieldValue('brandName', value)

    // Only auto-generate if slug hasn't been manually edited
    if (!isSlugManuallyEdited) {
      generateSlug(value)
    }
  }, [formik, generateSlug, isSlugManuallyEdited])

  const handleSlugChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    formik.setFieldValue('slug', value)
    setIsSlugManuallyEdited(true)
    clearError()
  }, [formik, clearError])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  // Reset manual edit flag when brand name is cleared
  useEffect(() => {
    if (!formik.values.brandName.trim()) {
      setIsSlugManuallyEdited(false)
      clearError()
    }
  }, [formik.values.brandName, clearError])

  return (
    // JSX with loading states and error handling
    <div>
      <input
        value={formik.values.brandName}
        onChange={handleBrandNameChange}
        // ...
      />

      <div className="relative">
        <input
          value={formik.values.slug}
          onChange={handleSlugChange}
          // ...
        />
        {isGenerating && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Icon icon="eos-icons:loading" className="text-lg text-gray-400" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
```

## API

### Options

```tsx
interface UseSlugGenerationOptions {
  onSuccess?: (slug: string) => void // Called when slug is successfully generated
  onError?: (error: string) => void // Called when generation fails
  debounceMs?: number // Debounce delay in milliseconds (default: 500)
}
```

### Returns

```tsx
interface UseSlugGenerationReturn {
  generateSlug: (brandName: string) => void // Trigger slug generation
  isGenerating: boolean // Loading state
  error: string | null // Error message
  clearError: () => void // Clear error state
  cleanup: () => void // Manual cleanup function
}
```

## Race Condition Prevention

The hook prevents race conditions through:

1. **AbortController**: Cancels previous HTTP requests when a new one starts
2. **Request ID tracking**: Ensures only the latest request's response is processed
3. **Debouncing**: Reduces the number of API calls by waiting for user to stop typing

## Error Handling

The hook handles various error scenarios:

- Network errors
- API validation errors (field-specific)
- Request cancellation (aborted requests are ignored)
- Malformed responses

Field-specific errors from the backend are extracted and displayed appropriately.
