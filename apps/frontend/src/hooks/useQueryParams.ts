import {useRouter} from 'next/router'

const useQueryParams = <T extends Record<string, any>>(initialParams: T) => {
  const router = useRouter()

  const updateQueryParams = (params: Partial<T>, replaceState = false) => {
    const newQuery = {
      ...router.query,
      ...params
    }

    // Remove undefined or empty string values
    Object.keys(newQuery).forEach(key => {
      if (newQuery[key] === undefined || newQuery[key] === '') {
        delete newQuery[key]
      }
    })

    // Use replace instead of push when replaceState is true
    if (replaceState) {
      router.replace(
        {
          pathname: router.pathname,
          query: newQuery
        },
        undefined,
        {shallow: true}
      )
    } else {
      router.push(
        {
          pathname: router.pathname,
          query: newQuery
        },
        undefined,
        {shallow: true}
      )
    }
  }

  return {
    queryParams: router.query as T,
    updateQueryParams
  }
}

export default useQueryParams
