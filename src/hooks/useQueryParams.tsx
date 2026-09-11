// useQueryParams.ts
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'

type PageQuery = {[key: string]: any; q?: string; per_page?: number; page?: number}

export default function useQueryParams<T extends PageQuery>(initialQueryParams?: T) {
  const router = useRouter()
  const [queryParams, setQueryParams] = useState<T>(() => {
    const initialParams = {} as T
    if (initialQueryParams) {
      Object.keys(initialQueryParams).forEach(key => {
        const paramValue = router.query[key]
        if (paramValue !== undefined) {
          // @ts-ignore
          initialParams[key] = paramValue as T[keyof T]
        } else {
          // @ts-ignore
          initialParams[key] = initialQueryParams[key]
        }
      })
    }
    return initialParams
  })

  // Update state if route changes
  useEffect(() => {
    setQueryParams(prevParams => {
      const updatedParams = {...prevParams}
      Object.keys(router.query).forEach(key => {
        // @ts-ignore
        updatedParams[key] = router.query[key]
      })
      return updatedParams as T
    })
  }, [router.query])

  const updateQueryParams = (newParams: Partial<T>, replacePrevious?: boolean) => {
    const updatedParams = {
      ...queryParams,
      ...newParams
    }

    const query = Object.keys(updatedParams)
      .filter(key => updatedParams[key] !== undefined && updatedParams[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(updatedParams[key])}`)
      .join('&')

    const routePath = `${router.pathname}?${query}`

    if (replacePrevious) {
      router.replace(routePath, undefined, {shallow: true})
    } else {
      router.push(routePath, undefined, {shallow: true})
    }
  }

  const clearAllFilters = () => {
    const query = Object.keys(initialQueryParams || {})
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(initialQueryParams![key])}`)
      .join('&')

    const routePath = `${router.pathname}?${query}`
    router.push(routePath, undefined, {shallow: true})
  }

  return {
    queryParams,
    updateQueryParams,
    clearAllFilters
  }
}
