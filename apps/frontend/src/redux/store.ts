// store.ts
import authReducer from '@/redux/apiSlice/authSlice'
import countryReducer from '@/redux/apiSlice/countrySlice'
import superAdminAuthReducer from '@/redux/apiSlice/superAdminAuthSlice'
import vendorReducer from '@/redux/apiSlice/vendorSlice'
import {api} from '../services/index'

import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {createWrapper} from 'next-redux-wrapper'
import chatReducer from './features/chatSlice'
import messagingReducer from './features/messagingSlice'
import openServiceModalReducer from './features/openServiceModalSlice'
import {persistMiddleware} from './middleware/persistMiddleWare'

const loadState = () => {
  if (typeof window !== 'undefined') {
    try {
      const serializedAuthState = localStorage.getItem('auth')
      const serializedCountryState = localStorage.getItem('country')

      if (serializedAuthState === null && serializedCountryState === null) {
        return undefined
      }

      return {
        auth: serializedAuthState ? JSON.parse(serializedAuthState) : undefined,
        country: serializedCountryState ? JSON.parse(serializedCountryState) : undefined
      }
    } catch (err) {
      return undefined
    }
  }
  return undefined
}

const makeStore = () => {
  const preloadedState = loadState()

  const store = configureStore({
    reducer: {
      auth: authReducer,
      vendor: vendorReducer,
      country: countryReducer,
      superAdminAuth: superAdminAuthReducer,
      messaging: messagingReducer,
      chat: chatReducer,
      openServiceModal: openServiceModalReducer,
      [api.reducerPath]: api.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware, persistMiddleware),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production'
  })

  setupListeners(store.dispatch)

  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper<AppStore>(makeStore, {debug: true})
