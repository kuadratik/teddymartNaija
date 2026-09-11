import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {Uuid} from '@/utils/fx'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {destroyCookie, parseCookies, setCookie} from 'nookies'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.baseUrl,
  prepareHeaders: (headers, {getState, endpoint, extra, type, forced}) => {
    const allCookies = parseCookies()
    const clipUuid = allCookies['Clip-Uid']

    // Check if this request is marked as super-admin via the X-Auth-Type header
    const authType = headers.get('X-Auth-Type')
    const isSuperAdminRoute =
      authType === 'super-admin' ||
      (endpoint &&
        (endpoint.includes('Brand') || endpoint.includes('Category') || endpoint.toLowerCase().includes('admin')))

    // Use super admin token for super admin routes, regular token for others
    const token = isSuperAdminRoute ? allCookies['superAdminToken'] : allCookies['token']

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    // Remove the X-Auth-Type header after using it (don't send to server)
    headers.delete('X-Auth-Type')

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

// Track if we're already in the process of logging out to prevent race conditions
let isLoggingOut = false

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  let unauthorized = result?.error?.status === 401

  if (unauthorized && !isLoggingOut) {
    // Check which token type was used for this request
    const allCookies = parseCookies()
    const endpoint = args?.endpoint || ''
    const isSuperAdminRoute =
      endpoint.includes('Brand') || endpoint.includes('Category') || endpoint.toLowerCase().includes('admin')

    const usedToken = isSuperAdminRoute ? allCookies['superAdminToken'] : allCookies['token']

    // Only proceed with logout if there was actually a token being used
    if (usedToken) {
      isLoggingOut = true

      try {
        // Attempt to retry the request once in case it was a temporary issue
        await new Promise(resolve => setTimeout(resolve, 500)) // Brief delay
        result = await baseQuery(args, api, extraOptions)

        // If retry succeeds, reset flag and return
        if (result?.error?.status !== 401) {
          isLoggingOut = false
          return result
        }

        // If still unauthorized after retry, proceed with logout
        if (isSuperAdminRoute) {
          // Only clear super admin token
          destroyCookie(null, 'superAdminToken')
          localStorage.removeItem('superAdminUser')

          // Redirect super admin to login
          if (window.location.pathname.startsWith('/super-admin')) {
            window.location.href = '/super-admin/login'
          }
        } else {
          // Clear regular user tokens
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

          // Redirect to home only from protected routes
          if (window.location.pathname.startsWith('/vendor') || window.location.pathname.startsWith('/customer')) {
            window.location.href = '/'
          }
        }
      } finally {
        // Reset flag after a delay to allow redirect to complete
        setTimeout(() => {
          isLoggingOut = false
        }, 1000)
      }
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
