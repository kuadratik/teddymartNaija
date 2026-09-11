import {setCredentials} from '@/redux/apiSlice/authSlice'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {parseCookies, destroyCookie} from 'nookies'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.baseUrl,
  prepareHeaders: (headers, {getState}) => {
    const allCookies = parseCookies()
    const clipUuid = JSON.parse(localStorage.getItem('Clip-Uid'))

    // Assuming you want to retrieve a specific cookie named 'authToken'
    const token = allCookies['token']

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    if (clipUuid) {
      headers.set('Clip-Uid', `${clipUuid}`)
    }

    headers.set('Accept', 'application/json')
    return headers
  }
})

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  let unauthorized = result?.error?.status === 401
  if (unauthorized) {
    // Clear the token and user from local storage
    destroyCookie(null, 'token')
    localStorage.removeItem('authUser')
    localStorage.removeItem('authToken')
    api.dispatch(
      setCredentials({
        token: null,
        user: null
      })
    )
    window.location.href = '/'
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
