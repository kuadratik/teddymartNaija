export interface OrderHistoryTopLevel {
  success: boolean
  message: string
  data: OrderHistoryData
}

export interface OrderHistoryData {
  current_page: number
  data: OrderHistoryDatum[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: OrderHistoryLink[]
  next_page_url: null
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface OrderHistoryDatum {
  id: number
  order_id: number
  listing_id: number
  listing_name: string
  quantity: number
  listing_price: string
  created_at: string
  updated_at: string
  order: OrderHistoryOrder
}

export interface OrderHistoryOrder {
  id: number
  uid: null
  store_id: number
  type: string
  order_number: string
  first_name: string
  last_name: string
  email: string
  phone: string
  shipping_cost: string
  subtotal: string
  total_amount: string
  currency: null
  status: string
  payment_status: null
  created_at: string
  updated_at: string
  user_id: number
}

export interface OrderHistoryLink {
  url: null | string
  label: string
  active: boolean
}
