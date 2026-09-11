import {setCredentials} from '@/redux/apiSlice/authSlice'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {parseCookies} from 'nookies'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.baseUrl,
  prepareHeaders: (headers, {getState}) => {
    const allCookies = parseCookies()
    // Assuming you want to retrieve a specific cookie named 'authToken'
    const token = allCookies['token']

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    headers.set('Accept', 'application/json')
    return headers
  }
})

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result?.error?.status === 401) {
    // Clear the token and user from local storage
    localStorage.removeItem('authUser')
    localStorage.removeItem('authToken')
    api.dispatch(
      setCredentials({
        token: null,
        user: null
      })
    )
  }
  return result
}

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  reducerPath: 'api',
  tagTypes: [],
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  endpoints: builder => ({
    // Define your endpoints here
  })
  // Configure additional options if needed
})

export const {
  useLazyQuery,
  useLazyMutation,
  useQuery,
  useMutation
  // Add other hooks as needed
} = api
