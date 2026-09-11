export interface IMessageTopLevel {
  success: boolean
  message: string
  data: IMessageData
}

export interface IMessageData {
  data: IMessageDatum[]
  path: string
  per_page: number
  next_cursor: null
  next_page_url: null
  prev_cursor: null
  prev_page_url: null
}

export interface IMessageDatum {
  id: number
  uuid: string
  user_id: number
  user_type: string
  converse_type: string
  title: null
  created_at: string
  updated_at: string
  read_at: string
  lastMessage: LastMessage
  respondent: Respondent | null
  unread: number
}

export interface LastMessage {
  id: number
  chat_id: number
  user_type: string
  user_id: number
  content: string
  attachment: null
  created_at: string
  updated_at: string
}
export interface ChatMessagesTopLevel {
  success: boolean
  message: string
  data: ChatMessagesData
}

export interface ChatMessagesData {
  data: ChatMessagesDatum[]
  path: string
  per_page: number
  next_cursor: null
  next_page_url: null
  prev_cursor: null
  prev_page_url: null
}

export interface ChatMessagesDatum {
  id: number
  chat_id: number
  user_type: string
  user_id: number
  content: string
  attachment: null
  created_at: string
  updated_at: string
  user: ChatMessagesUser
}

export interface ChatMessagesUser {
  id: number
  clipper_uid: string
  first_name: string
  last_name: string
  google_id: string
  offers_product: boolean
  offers_service: boolean
  has_store: boolean
  has_ads: boolean
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
}

export interface Respondent {
  user_id: number
  first_name: string
  last_name: string
  user_type: string
}
