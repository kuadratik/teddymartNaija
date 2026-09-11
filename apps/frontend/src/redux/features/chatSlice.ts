// chatSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
interface TypingStatus {
  userId: number
  isTyping: boolean
}
interface Message {
  id: string
  content: string
  user_id: number
  chat_id: string
  created_at: string
}

interface ChatState {
  messages: Message[]
  typingUsers: {
    [userId: number]: boolean
  }
}

const initialState: ChatState = {
  messages: [],
  typingUsers: {}
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    setTypingStatus: (state, action: PayloadAction<TypingStatus>) => {
      const {userId, isTyping} = action.payload
      state.typingUsers[userId] = isTyping
    },
    clearMessages: state => {
      state.messages = []
    }
  }
})

export const {addMessage, setTypingStatus, clearMessages} = chatSlice.actions
export default chatSlice.reducer
