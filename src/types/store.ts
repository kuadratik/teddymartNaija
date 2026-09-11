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
  price: string
  description: string
  additional_information: string | null
  images: string[] // Assuming images are an array of strings (URLs or paths)
  is_available: boolean
  created_at: string
  updated_at: string
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
  listings: Listing[]
}
