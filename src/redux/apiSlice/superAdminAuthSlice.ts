// superAdminAuthSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface SuperAdminAuthState {
  token: string | null
  admin: any | null
}

const initialState: SuperAdminAuthState = {
  token: null,
  admin: null
}

const superAdminAuthSlice = createSlice({
  name: 'superAdminAuth',
  initialState,
  reducers: {
    setSuperAdminCredentials(state, action: PayloadAction<{token: string | null; admin: any}>) {
      state.token = action.payload.token
      state.admin = action.payload.admin
    },
    logoutSuperAdmin(state) {
      state.token = null
      state.admin = null
    }
  }
})

export const {setSuperAdminCredentials, logoutSuperAdmin} = superAdminAuthSlice.actions
export default superAdminAuthSlice.reducer
