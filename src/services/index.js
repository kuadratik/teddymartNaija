import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {Uuid} from '@/utils/fx'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {destroyCookie, parseCookies, setCookie} from 'nookies'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.baseUrl,
  prepareHeaders: (headers, {getState}) => {
    const allCookies = parseCookies()
    const clipUuid = allCookies['Clip-Uid']

    // Assuming you want to retrieve a specific cookie named 'authToken'
    const token = allCookies['token']

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    // Always send the Clip-Uid header if available
    if (clipUuid) {
      headers.set('Clip-Uid', `${clipUuid}`)
      headers.set('session-uid', `${clipUuid}`)
    } else {
      // If no Clip-Uid exists, create one
      const newUid = Uuid()
      setCookie(null, 'Clip-Uid', newUid, {
        maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
        path: '/'
      })
      headers.set('Clip-Uid', newUid)
      headers.set('session-uid', newUid)
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

    // Important: DO NOT destroy the Clip-Uid cookie here
    // as it would cause cart items to disappear

    api.dispatch(
      setCredentials({
        token: null,
        user: null
      })
    )
    api.dispatch(
      setActiveStore({
        activeUser: null
      })
    )

    if (window.location.pathname.startsWith('/vendor') || window.location.pathname.startsWith('/customer')) {
      window.location.href = '/'
    }
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
