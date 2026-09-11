import {BaseResponse} from './types'

export interface SpecifiedStoreModel extends BaseResponse {
  data: Store
}

export interface SpecifiedStoreQueryParams {
  listingType: 'product' | 'service'
  store: string | string[] | undefined
}

export interface StoreProuctQueryParams {
  listing: string | string[] | undefined | null
  store: string | string[] | undefined
}

export type Listing = {
  id: number
  store_id: number
  user_id: number
  category_id: number
  name: string
  slug: string
  type: string
  discount: string
  display_price: string
  discounted_price: string
  price: string
  description: string
  additional_information: string | null
  images: string[] // Assuming images are an array of strings (URLs or paths)
  is_available: boolean
  created_at: string
  updated_at: string
  contact_number?: string
  profile_picture_path?: string
  whatsapp_number?: string
  store?: any
  currency?: CurrencyType
}

export type CurrencyType = 'NGN' | 'CAD' | 'USD' | 'GBP' | 'EUR' | 'AUD'

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
  listings: Listing[]
}

// Payout Details
export interface PayoutDetailTopLevel {
  success: boolean
  message: string
  data: PayoutDetailDatum[]
}

export interface PayoutDetailDatum {
  id: number
  store_id: number
  bank_name: string
  account_name: string
  account_number: string
  is_default: number
  detail_type: string
  bank_code: string | null
  sort_code: string | null
  iban: string | null
  institution_number: string | null
  transit_number: string | null
  interac_information: string | null
  zelle_information: string | null
  created_at: string
  updated_at: string
}
export interface ProductListingQuery {
  search?: string
  status?: string
  listingType?: 'product' | 'service'
  per_page?: number
  page?: number
  current_page?: number
  tab?: string
  availability?: any
  order_status?: string
  is_draft?: any
  sort_date?: any
  sort_price?: any
}
