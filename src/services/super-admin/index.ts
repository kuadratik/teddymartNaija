import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['superAdminApi']
})

export interface Category {
  id: number
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CategoryResponse {
  success: boolean
  message: string
  data: Category[]
}

export interface CreateCategoryRequest {
  name: string
}

export interface CreateCategoryResponse {
  success: boolean
  message: string
  data: Category
  errors?: {
    name?: string[]
  }
}

export interface CreateBrandRequest {
  name: string
  category_ids: number[]
  description: string
  logo_url: string
  source_url: string
  target_url: string
  is_active: boolean
}

export interface UpdateBrandRequest {
  name?: string
  category_ids?: number[]
  description?: string
  logo_url?: string
  source_url?: string
  target_url?: string
  is_active?: boolean
}

export interface CreateBrandResponse {
  success: boolean
  message: string
  data: any
  errors?: Record<string, string[]>
}

export interface UpdateBrandResponse {
  success: boolean
  message: string
  data: Brand
  errors?: Record<string, string[]>
}

export interface Brand {
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
  categories: Category[]
}

export interface BrandsResponse {
  success: boolean
  message: string
  data: {
    current_page: number
    data: Brand[]
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
}

export interface ArchiveResponse {
  success: boolean
  message: string
  data: Brand
}

export const SuperAdminEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    // Get all brand categories
    getBrandCategories: build.query<CategoryResponse, void>({
      query: () => ({
        url: `/admin/brands/categories/all`,
        method: 'GET',
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      providesTags: ['superAdminApi']
    }),

    // Create a new brand category
    createBrandCategory: build.mutation<CreateCategoryResponse, CreateCategoryRequest>({
      query: body => ({
        url: `/admin/brands/categories`,
        method: 'POST',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superAdminApi']
    }),

    // Create a new brand
    createBrand: build.mutation<CreateBrandResponse, CreateBrandRequest>({
      query: body => ({
        url: `/admin/brands`,
        method: 'POST',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superAdminApi']
    }),

    // Get all brands with pagination and filters
    getBrands: build.query<
      BrandsResponse,
      {page?: number; search?: string; include_archived?: boolean; per_page?: number} | void
    >({
      query: args => {
        const page = args && 'page' in args ? args.page : 1
        const search = args && 'search' in args ? args.search : undefined
        const includeArchived = args && 'include_archived' in args ? args.include_archived : undefined
        const perPage = args && 'per_page' in args ? args.per_page : undefined

        const params: Record<string, any> = {
          page: page || 1
        }

        if (search) params.search = search
        if (includeArchived !== undefined) params.include_archived = includeArchived
        if (perPage) params.per_page = perPage

        return {
          url: `/admin/brands`,
          method: 'GET',
          params,
          headers: {
            'X-Auth-Type': 'super-admin'
          }
        }
      },
      providesTags: ['superAdminApi']
    }),

    // Archive a brand
    archiveBrand: build.mutation<ArchiveResponse, number>({
      query: brandId => ({
        url: `/admin/brands/${brandId}/archive`,
        method: 'PATCH',
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superAdminApi']
    }),

    // Unarchive a brand
    unarchiveBrand: build.mutation<ArchiveResponse, number>({
      query: brandId => ({
        url: `/admin/brands/${brandId}/unarchive`,
        method: 'PATCH',
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superAdminApi']
    }),

    // Update a brand
    updateBrand: build.mutation<UpdateBrandResponse, {brandId: number; data: UpdateBrandRequest}>({
      query: ({brandId, data}) => ({
        url: `/admin/brands/${brandId}`,
        method: 'PUT',
        body: data,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superAdminApi']
    })
  }),

  overrideExisting: true
})

export const {
  useGetBrandCategoriesQuery,
  useCreateBrandCategoryMutation,
  useCreateBrandMutation,
  useGetBrandsQuery,
  useArchiveBrandMutation,
  useUnarchiveBrandMutation,
  useUpdateBrandMutation
} = SuperAdminEndpoint
