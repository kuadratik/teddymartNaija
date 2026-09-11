// authSlice.ts
import {User} from '@/types/types'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface AuthState {
  token: any | null
  user: User | null
  activeUser: any
}

const initialState: AuthState = {
  token: null,
  user: null,
  activeUser: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{token: any | null; user: any}>) {
      state.token = action.payload.token
      state.user = action.payload.user
    },
    setActiveStore(state, action: PayloadAction<{activeUser: any}>) {
      state.activeUser = action.payload.activeUser
    },

    logout(state) {
      state.token = null
      state.user = null
      state.activeUser = null
    }
  }
})

export const {setCredentials, logout, setActiveStore} = authSlice.actions
export default authSlice.reducer
