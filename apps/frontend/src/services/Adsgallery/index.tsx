import {AdsGalleryQueryParams, GetAdsGalleryQuery} from '@/types/adsgallery'
import {BaseResponse} from '@/types/types'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['all-ads-gallery', 'single-ads-gallery', 'user-ads-gallery', 'user-promotion']
})

export const ClipsEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    adsGallery: build.query<BaseResponse, {category_ids?: number[]; params: GetAdsGalleryQuery; currency: string}>({
      query: ({params, currency, category_ids}) => {
        const queryParams: Record<string, any> = {...params}

        // Special handling for array parameters
        // Remove category_ids from params object to handle it manually
        delete queryParams.category_ids

        // Create the base URL
        let url = `front/advert/gallery`

        // Build the query string manually to ensure proper array parameter formatting
        const queryStrings = []

        // Add all regular params
        for (const [key, value] of Object.entries(queryParams)) {
          if (value !== undefined && value !== null) {
            queryStrings.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          }
        }

        // Add category_ids with proper bracket notation
        if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
          category_ids.forEach(id => {
            queryStrings.push(`category_ids[]=${encodeURIComponent(id.toString())}`)
          })
        }

        // Append query string to URL if there are any params
        if (queryStrings.length > 0) {
          url += `?${queryStrings.join('&')}`
        }

        return {
          url,
          method: 'GET',
          // Don't include params here since we're handling them manually
          headers: {
            currency
          }
        }
      },
      providesTags: ['all-ads-gallery']
    }),

    getSingleAdsGallery: build.query<any, {params: AdsGalleryQueryParams}>({
      query: ({params}) => ({
        url: `front/advert/${params.advert}/gallery`,
        method: 'GET'
      }),
      providesTags: ['single-ads-gallery']
    }),
    getUserAdsGallery: build.query<any, {params: GetAdsGalleryQuery}>({
      query: ({params}) => ({
        url: `front/advert`,
        method: 'GET',
        params
      }),
      providesTags: ['user-ads-gallery']
    }),
    getUserPromotion: build.query<any, any>({
      query: ({}) => ({
        url: `store/advert/store/promoted-store`,
        method: 'GET'
      }),
      providesTags: ['user-promotion']
    })
  }),
  overrideExisting: true
})

export const {useAdsGalleryQuery, useGetSingleAdsGalleryQuery, useGetUserAdsGalleryQuery, useGetUserPromotionQuery} =
  ClipsEndpoint
