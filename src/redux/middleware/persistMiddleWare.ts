import {Middleware} from '@reduxjs/toolkit'
import {AppState} from '../store'

export const persistMiddleware: Middleware = store => next => action => {
  const result = next(action)

  if (typeof window !== 'undefined') {
    const state = store.getState() as AppState
    localStorage.setItem('auth', JSON.stringify(state.auth))
    localStorage.setItem('country', JSON.stringify(state.country))
  }

  return result
}
