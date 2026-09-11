export interface IStoreListingResponse {
  success: boolean
  message: string
  data: IStoreListingData
}

export interface IStoreListingData {
  current_page: number
  data: IStoreListingDatum[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: IStoreListingLink[]
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface IStoreListingDatum {
  id: number
  user_id: number
  name: string
  slug: string
  type: IStoreListingType
  payment_status: 'paid' | 'unpaid' | 'success' | 'pending' | 'failed' | null
  contact_number: string
  whatsapp_number: string
  profile_picture_path: string
  banner_path: string
  description: string
  views_count: number
  address1: string
  listings_count: number
  address2: null | string
  state: IStoreListingState
  city: string
  postal_code: null | string
  currency: IStoreListingCurrency
  country_id: number | null
  created_at: string
  updated_at: string
  active: number
  step: number
  order_number: null
  fee_amount: string
  fee_gateway: 'stripe' | 'paystack' | null
  fee_paid_at: string | null
  user: IStoreListingUser
}

export enum IStoreListingCurrency {
  Ngn = 'NGN'
}

export enum IStoreListingPaymentStatus {
  Paid = 'paid'
}

export enum IStoreListingState {
  AbujaFederalCapitalTerritory = 'Abuja Federal Capital Territory',
  Ekiti = 'Ekiti',
  Lagos = 'Lagos',
  Oyo = 'Oyo'
}

export enum IStoreListingType {
  Product = 'product'
}

export interface IStoreListingUser {
  id: number
  offers_product: boolean
  offers_service: boolean
}

export interface IStoreListingLink {
  url: null | string
  label: string
  active: boolean
}
