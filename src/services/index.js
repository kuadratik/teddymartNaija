import {setActiveStore, setCredentials} from '@/redux/apiSlice/authSlice'
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {parseCookies, destroyCookie} from 'nookies'
import {Uuid} from '@/utils/fx'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.baseUrl,
  prepareHeaders: (headers, {getState}) => {
    // @ts-ignore
    const selectedCurrency = getState()?.country?.selectedLanguage?.value
    console.log(selectedCurrency)
    const allCookies = parseCookies()
    const clipUuid = JSON.parse(localStorage.getItem('Clip-Uid'))

    // Assuming you want to retrieve a specific cookie named 'authToken'
    const token = allCookies['token']

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    if (selectedCurrency) {
      headers.set('currency', ` ${selectedCurrency}`)
    }

    if (clipUuid) {
      headers.set('Clip-Uid', `${clipUuid}`)
      headers.set('session-uid', `${clipUuid}`)
    }

    headers.set('Accept', 'application/json')
    return headers
  }
})

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  const id = Uuid()
  let result = await baseQuery(args, api, extraOptions)
  let unauthorized = result?.error?.status === 401
  if (unauthorized) {
    // Clear the token and user from local storage
    destroyCookie(null, 'token')
    localStorage.removeItem('authUser')
    localStorage.removeItem('authToken')
    localStorage.removeItem('Clip-Uid')
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

    localStorage.setItem('Clip-Uid', JSON.stringify(id))
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
