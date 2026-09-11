export interface GetAdsGalleryQuery {
  search?: string
  status?: string
  type?: 'product' | 'service'
  per_page?: number
  state?: string
  country_id?: number | string
  page?: number
  current_page?: number
  price_min?: number
}

export interface AdsGalleryQueryParams {
  advert: string | string[] | undefined
}
