// store.ts
import authReducer from '@/redux/apiSlice/authSlice'
import vendorReducer from '@/redux/apiSlice/vendorSlice'
import {api} from '../services/index'

import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {createWrapper} from 'next-redux-wrapper'
import {persistMiddleware} from './middleware/persistMiddleWare'

const loadState = () => {
  if (typeof window !== 'undefined') {
    try {
      const serializedAuthState = localStorage.getItem('auth')
      if (serializedAuthState === null) {
        return undefined
      }
      return {
        auth: serializedAuthState ? JSON.parse(serializedAuthState) : undefined
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
