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
  next_page_url: string
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface BusinessListingDatum {
  id: number
  industry_id: number
  user_id: number
  business_name: string
  business_slug: string
  business_description: null | string
  business_email: null | string
  secondary_business_email: null
  business_address: null | string
  business_contact_number: string
  secondary_contact_number: null
  website_link: null
  owner_role: null
  owner_name: null
  business_logo_url: string
  color: string
  show_business_description: boolean
  show_business_email: boolean
  show_secondary_email: boolean
  show_secondary_contact: boolean
  show_website_link: boolean
  show_business_address: boolean
  created_at: string
  updated_at: string
  country_id: null
  state: null
  industry: Industry
  country: BusinessListingCountry
}

export interface BusinessListingCountry {
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

export interface Industry {
  id: number
  name: string
  slug: string
  description: null
  created_at: string
  updated_at: string
}
export interface BusinessListingLink {
  url: null | string
  label: string
  active: boolean
}

// single business listing
export interface singleBusinessListingsTopLevel {
  success: boolean
  message: string
  data: BusinessListingDatum
}
export interface BusinessIndustryTopLevel {
  success: boolean
  message: string
  data: BusinessIndustryDatum[]
}

export interface BusinessIndustryDatum {
  id: number
  name: string
  slug: string
  description: null
  created_at: string
  updated_at: string
}
