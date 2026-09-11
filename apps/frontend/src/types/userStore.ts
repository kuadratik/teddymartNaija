export interface IUserStoreResponse {
  success: boolean
  message: string
  data: IUserStoreDatum[]
}

export interface IUserStoreDatum {
  id: number
  user_id: number
  name: string
  slug: string
  type: string
  payment_status: string
  contact_number: string
  whatsapp_number: string
  profile_picture_path: null | string
  banner_path: null | string
  description: string
  views_count: number
  address1: string
  address2: null | string
  state: string
  city: string
  postal_code: null | string
  currency: string
  country_id: number | null
  created_at: string
  updated_at: string
  active: number
  step: number
  order_number: null | string
  fee_amount: string
  action_note: null
  fee_gateway: null | string
  fee_paid_at: string | null
  store_fee_history_id: number | null
  listings_count: number
  user: IUserStoreUser
  country: IUserStoreCountry | null
  shipping_methods: IUserStoreShippingMethod[]
  categories: IUserStoreCategory[]
}

export interface IUserStoreCategory {
  id: number
  name: string
  slug: string
  type: string
  description: null
  created_at: string
  updated_at: string
  pivot: IUserStorePivot
}

export interface IUserStorePivot {
  store_id: number
  category_id: number
}

export interface IUserStoreCountry {
  id: number
  name: string
  code: string
  phonecode: string
  emoji: string
  currency_code: string
  currency_name: string
  created_at: null
  updated_at: null
}

export interface IUserStoreShippingMethod {
  id: number
  store_id: number
  method_type: string
  pick_up_time: null | string
  location: string
  amount: null | string
  price_per_weight: null
  duration_number: number | null
  duration_type: null | string
  created_at: string
  updated_at: string
}

export interface IUserStoreUser {
  id: number
  offers_product: boolean
  offers_service: boolean
}
