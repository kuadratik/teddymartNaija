// authSlice.ts

import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface ISelectedCountryType {
  value: string
  name: 'United States' | 'Nigeria' | 'Canada'
  // name: string
  key: string
}

interface VendorState {
  selectedLanguage: ISelectedCountryType
  selectionOccurred: boolean
}

const initialState: VendorState = {
  selectedLanguage: {
    key: 'us',
    value: 'USD',
    name: 'United States'
  },
  selectionOccurred: false
}

const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setSelectedLanguage(state, action: PayloadAction<ISelectedCountryType>) {
      state.selectedLanguage = action.payload
    },
    setSelectionOccurred(state) {
      state.selectionOccurred = true
    }
  }
})

export const {setSelectedLanguage, setSelectionOccurred} = countrySlice.actions
export default countrySlice.reducer
