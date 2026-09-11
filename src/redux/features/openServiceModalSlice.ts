import {createSlice} from '@reduxjs/toolkit'
import {HYDRATE} from 'next-redux-wrapper'

const initialState = {
  isLargeOpenServiceModal: false,
  isOpenMobileServiceModal: false
}

const openServiceModalSlice = createSlice({
  name: 'openServiceModal',
  initialState,
  reducers: {
    toggleOpenMobileServiceModal: state => {
      state.isOpenMobileServiceModal = !state.isOpenMobileServiceModal
    },
    toggleLargeOpenServiceModal: state => {
      state.isLargeOpenServiceModal = !state.isLargeOpenServiceModal
    },
    toggleCloseMobileServiceModal: state => {
      state.isOpenMobileServiceModal = false // Explicitly set to false for closing
    },
    toggleLargeCloseServiceModal: state => {
      state.isLargeOpenServiceModal = false
    }
  }
})

export const {toggleOpenMobileServiceModal, toggleCloseMobileServiceModal, toggleLargeOpenServiceModal, toggleLargeCloseServiceModal} =
  openServiceModalSlice.actions
export default openServiceModalSlice.reducer
