import {createSlice, PayloadAction} from '@reduxjs/toolkit'

// Define the types
interface StoreInfo {
  id: string
  name: string
  // Add other store properties you need
}

interface MessagingState {
  selectedStores: any[]
  activeConversations: string[] // Store IDs with active conversations
  isOpenMobileModal: boolean // Add this to the interface
}

// Initial state
const initialState: MessagingState = {
  selectedStores: [],
  isOpenMobileModal: false,
  activeConversations: []
}

// Create the slice
const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    addStoreToMessaging: (state, action: PayloadAction<StoreInfo>) => {
      // Check if store already exists to avoid duplicates
      const storeExists = state.selectedStores.some(store => store.id === action.payload.id)

      if (!storeExists) {
        state.selectedStores.push(action.payload)
        state.activeConversations.push(action.payload.id)
      }
    },

    removeStoreFromMessaging: (state, action: PayloadAction<string>) => {
      state.selectedStores = state.selectedStores.filter(store => store.id !== action.payload)
      state.activeConversations = state.activeConversations.filter(id => id !== action.payload)
    },

    clearAllConversations: state => {
      state.selectedStores = []
      state.activeConversations = []
    },

    // Add these new reducers for toggle functionality
    toggleMobileChatMessageModal: state => {
      state.isOpenMobileModal = !state.isOpenMobileModal
    },

    setMobileChatMessageModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenMobileModal = action.payload
    }
  }
})

// Export actions and reducer
export const {
  addStoreToMessaging,
  removeStoreFromMessaging,
  clearAllConversations,
  toggleMobileChatMessageModal, // Export the new actions
  setMobileChatMessageModal
} = messagingSlice.actions

export default messagingSlice.reducer
