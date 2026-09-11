export interface ISelectedShippingAddress {
  id: number
  user_id: number
  country: string
  state: string
  lga: string
  city: string
  landmark: string
  address: string
  email: string
  saved: boolean
  created_at: string
  updated_at: string
  phone: string
  first_name: string
  last_name: string
}

export interface IStoreMethodsTopLevel {
  success: boolean
  message: string
  data: IStoreMethodsDatum[]
}

export interface IStoreMethodsDatum {
  store_id: number
  store_name: string
  storeMethodTypes: string[]
  storeMethods: any[] | StoreMethodsClass
}

export interface StoreMethodsClass {
  'store pick-up': StorePickUp[]
  'vendor-fulfilled shipping': StorePickUp[]
}

export interface StorePickUp {
  id: number
  store_id: number
  method_type: string
  pick_up_time: null | string
  location: string
  amount: null | string
  created_at: string
  updated_at: string
}

export interface IPaymentPayload {
  payment_gateway: string
  currency_code: string
  first_name: string
  last_name: string
  email: string
  phone: string
  shipping_address_id: number
  store_shipping_methods: StoreShippingMethod[]
}

export interface StoreShippingMethod {
  store_id: number
  shipping_method_id: number
}

export interface IPaymentSuccessCheckoutDataTopLevel {
  id: number
  uid: string
  store_id: number
  type: string
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  store_shipping_method_id: number
  shipping_cost: string
  subtotal: string
  total_amount: string
  currency: string
  status: string
  payment_status: string
  created_at: Date
  updated_at: Date
  user_id: number
  shipping_address_id: number
  order_details: PaymentSuccessCheckoutDataOrderDetail[]
  store: PaymentSuccessCheckoutDataStore
}
export interface PaymentSuccessCheckoutDataStore {
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
  address2: null
  state: string
  city: string
  postal_code: string
  currency: string
  country_id: number
  created_at: Date
  updated_at: Date
  user: PaymentSuccessCheckoutDataUser
}

export interface PaymentSuccessCheckoutDataUser {
  id: number
  offers_product: boolean
  offers_service: boolean
}

export interface PaymentSuccessCheckoutDataOrderDetail {
  id: number
  order_id: number
  listing_id: number
  listing_name: string
  quantity: number
  listing_price: string
  created_at: string
  updated_at: string
  listing: PaymentSuccessCheckoutDataListing
}

export interface PaymentSuccessCheckoutDataListing {
  id: number
  images: string[]
  attributes: PaymentSuccessCheckoutDataAttributes
  variants: any[]
}

export interface PaymentSuccessCheckoutDataAttributes {
  id: number
  listing_id: number
  measurement: string
  product_model: null
  brand: null
  material: null
  color: null
  size: string
  tags: string
  size_chart_html: null
  size_chart_image: string
  created_at: string
  updated_at: string
}
