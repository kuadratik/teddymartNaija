export interface IUserTransactionHistoryResponse {
  success: boolean
  message: string
  data: Array<IUserTransactionHistoryDatum[]>
}

export interface IUserTransactionHistoryDatum {
  id: number
  uid: null | string
  store_id: number
  type: 'product' | 'service'
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  store_shipping_method_id: number | null
  shipping_cost: string
  subtotal: string
  total_amount: string
  currency: string | null
  status: string
  payout_status: string
  payment_status: 'completed_payment' | 'pending_payment' | 'failed_payment' | null
  shipped_at: null
  delivered_notification_count: number
  vendor_notified_at: null
  created_at: string
  updated_at: string
  user_id: number
  shipping_address_id: number | null
  order_details: IUserTransactionHistoryOrderDetail[]
  store: IUserTransactionHistoryStore
  shipping_address: ShippingAddress | null
}

export interface IUserTransactionHistoryOrderDetail {
  id: number
  order_id: number
  listing_id: number
  variant_id: number | null
  variant_name: null | string
  listing_name: string
  quantity: number
  listing_price: string
  created_at: Date
  updated_at: Date
  user_rating: UserRating[]
  listing: Listing | null
  variant: Variant | null
}

export interface Listing {
  id: number
  store_id: number
  user_id: number
  category_id: number
  name: string
  slug: string
  is_draft: boolean
  sku: string | null
  type: string
  quantity: number
  price: string
  discount: null
  discounted_price: null
  display_price: string
  currency: string
  discount_start_date: null
  discount_end_date: null
  description: string
  additional_information: null | string
  views_count: number
  images: string[]
  is_available: boolean
  created_at: string
  updated_at: string
  deleted_at: null
  attributes: Attributes | null
  variants: Variant[]
}

export interface Attributes {
  id: number
  listing_id: number
  measurement: string
  product_model: string | null
  brand: string | null
  material: string | null
  color: string | null
  size: string
  tags: string
  size_chart_html: null | string
  size_chart_image: string
  created_at: Date
  updated_at: Date
}

export interface Variant {
  id: number
  listing_id: number
  name: string
  quantity: number
  price: string
  discount: null
  discounted_price: null
  display_price: string
  size: string
  color: null | string
  measurement: string
  discount_start_date: null
  discount_end_date: null
  images: string[]
  created_at: string
  updated_at: string
}

export interface UserRating {
  id: number
  user_id: number
  listing_id: number
  store_id: number
  rating: number
  created_at: string
  updated_at: string
}

export interface ShippingAddress {
  id: number
  user_id: number
  country: string
  state: string
  lga: string
  city: string
  landmark: string
  address: string
  saved: boolean
  created_at: Date
  updated_at: Date
  deleted_at: null
}

export interface IUserTransactionHistoryStore {
  id: number
  user_id: number
  name: string
  slug: string
  type: string
  contact_number: string
  whatsapp_number: string
  profile_picture_path: string
  banner_path: string
  description: string
  views_count: number
  address1: string
  address2: string | null
  state: string
  city: string
  postal_code: null | string
  currency: string
  country_id: number | null
  created_at: Date
  updated_at: Date
  user: User
}

export interface User {
  id: number
  offers_product: boolean
  offers_service: boolean
}
