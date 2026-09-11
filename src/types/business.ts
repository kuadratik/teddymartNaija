export interface BusinessListingTopLevel {
  success: boolean
  message: string
  data: BusinessListingData
}

export interface BusinessListingData {
  current_page: number
  data: BusinessListingDatum[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: BusinessListingLink[]
  next_page_url: null
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface BusinessListingDatum {
  id: number
  industry_id: number
  business_name: string
  business_slug: string
  business_description: string
  business_email: string
  business_address: string
  business_contact_number: string
  business_logo_url: null
  show_business_description: number
  show_business_email: number
  show_business_address: number
  created_at: string
  updated_at: string
}

export interface BusinessListingLink {
  url: null | string
  label: string
  active: boolean
}
