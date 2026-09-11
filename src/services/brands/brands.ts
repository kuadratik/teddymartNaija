import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['brandsApi']
})

export interface BrandCategory {
  id: number
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
  pivot?: {
    brand_id: number
    brand_category_id: number
  }
}

export interface BrandData {
  id: number
  name: string
  description: string
  logo_url: string
  source_url: string
  target_url: string
  is_active: boolean
  is_archived: boolean
  created_at: string
  updated_at: string
  categories: BrandCategory[]
}

export interface BrandsPaginationData {
  current_page: number
  data: BrandData[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface BrandsResponse {
  success: boolean
  message: string
  data: BrandsPaginationData
}

export interface BrandCategoriesResponse {
  success: boolean
  message: string
  data: BrandCategory[]
}

export interface GetBrandsParams {
  page?: number
  per_page?: number
  search?: string
  category_ids?: number[]
}

export const BrandsEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getBrands: build.query<BrandsResponse, GetBrandsParams>({
      query: args => {
        const params = new URLSearchParams()

        if (args.page !== undefined) params.append('page', args.page.toString())
        if (args.per_page !== undefined) params.append('per_page', args.per_page.toString())
        if (args.search) params.append('search', args.search)
        if (args.category_ids && args.category_ids.length > 0) {
          args.category_ids.forEach(id => {
            params.append('category_ids[]', id.toString())
          })
        }

        const queryString = params.toString()
        return {
          url: `/front/brands${queryString ? `?${queryString}` : ''}`,
          method: 'GET'
        }
      },
      providesTags: ['brandsApi']
    }),

    getBrandCategories: build.query<BrandCategoriesResponse, void>({
      query: () => ({
        url: `/front/brand-categories`,
        method: 'GET'
      }),
      providesTags: ['brandsApi']
    })
  })
})

export const {useGetBrandsQuery, useGetBrandCategoriesQuery} = BrandsEndpoint
