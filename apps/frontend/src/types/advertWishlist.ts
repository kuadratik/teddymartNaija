export interface IAdvertWishlistTopLevel {
  success: boolean
  message: string
  data: IAdvertWishlistDatum[]
}

export interface IAdvertWishlistDatum {
  id: number
  store_id: number
  user_id: number
  category_id: number
  name: string
  slug: string
  is_draft: boolean
  sku: null | string
  type: string
  quantity: number
  price: string
  discount: null | string
  discounted_price: null | string
  display_price: string
  currency: string
  discount_start_date: string | null
  discount_end_date: string | null
  description: string
  additional_information: null | string
  views_count: number
  images: string[]
  is_available: boolean
  created_at: string
  updated_at: string
  deleted_at: null
  pivot: IAdvertWishlistPivot
  attributes: IAdvertWishlistAttributes
  variants: IAdvertWishlistVariant[]
  store: IAdvertWishlistStore
}

export interface IAdvertWishlistAttributes {
  id: number
  listing_id: number
  measurement: string
  product_model: null | string
  brand: null | string
  material: null | string
  color: null | string
  size: string
  tags: string
  size_chart_html: null | string
  size_chart_image: string
  created_at: string
  updated_at: string
}

export interface IAdvertWishlistPivot {
  wishlistable_type: string
  user_id: number
  wishlistable_id: number
  created_at: string
  updated_at: string
}

export interface IAdvertWishlistStore {
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
  address2: null | string
  state: string
  city: string
  postal_code: string
  currency: string
  country_id: number | null
  created_at: string
  updated_at: string
  user: IAdvertWishlistUser
}

export interface IAdvertWishlistUser {
  id: number
  offers_product: boolean
  offers_service: boolean
}

export interface IAdvertWishlistVariant {
  id: number
  listing_id: number
  name: string
  quantity: number
  price: string
  discount: string
  discounted_price: string
  display_price: string
  size: string
  color: string
  measurement: string
  discount_start_date: string
  discount_end_date: string
  images: string[]
  created_at: string
  updated_at: string
}

// advertRatings types
export interface IAdvertRatingsTopLevel {
  success: boolean
  message: string
  data: IAdvertRatingsData
}

export interface IAdvertRatingsData {
  ratings: IAdvertRatingsRating[]
  average_rating: number
  total_ratings: number
}

export interface IAdvertRatingsRating {
  id: number
  advert_listing_id: number
  user_id: null
  guest_id: string
  rating: number
  name: string
  review: null
  created_at: string
  updated_at: string
  user: null
}
