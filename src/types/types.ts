export interface BaseResponse {
  success: boolean
  message: string
  data?: any
}

export interface TopLoginUserLevel extends BaseResponse {
  data: loginData
}

export interface loginData {
  token: string
  user: User
}

export interface ActiveUserLevel extends BaseResponse {
  data: User
}

export interface loginUser {
  id: number
  email: string
  user_type: string
  role_id: null
  is_owner: boolean
  is_active: boolean
  google_id: null
  apple_id: null
  fcm_token: string
  web_fcm_token: null
  email_verified_at: null
  user_school: number[]
  created_at: Date
  updated_at: Date
}

export interface LoginRequestModel {
  email?: string
  password?: string
}

export interface SignUpRequestModel extends LoginRequestModel {
  first_name?: string
  last_name?: string
  password_confirmation?: string
}

export interface VerifyRequestModel extends SignUpRequestModel {
  code?: string
}

type Store = {
  id: number
  user_id: number
  name: string
  slug: string
  contact_number: string
  whatsapp_number: string
  profile_picture_path: string
  banner_path: string
  description: string
  address1: string
  address2: string
  state: string
  city: string
  postal_code: string
  created_at: string
  updated_at: string
  country_id: string
}

export type User = {
  id: number
  first_name: string
  last_name: string
  offers_product: boolean
  offers_service: boolean
  has_store: boolean
  email: string
  email_verified_at: string | null
  created_at: string
  updated_at: string
  store: any
}

export type Status = 'Paid' | 'New' | 'Shipped' | 'Cancelled' | 'Delivered'

export type CategoryListType = {
  created_at: string
  description: string | null
  id: number
  name: string
  slug: string
  type: string
  updated_at: string
}
