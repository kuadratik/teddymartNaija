import {BaseResponse} from '@/types/types'
import {api} from '..'
import {SpecifiedStoreModel, SpecifiedStoreQueryParams} from '@/types/store'
import {AdsGalleryQueryParams, GetAdsGalleryQuery} from '@/types/adsgallery'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['all-ads-gallery', 'single-ads-gallery', 'user-ads-gallery', 'user-promotion']
})

export const ClipsEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    adsGallery: build.mutation<BaseResponse, {body: any; params: GetAdsGalleryQuery; currency: any}>({
      query: ({body, params, currency}) => ({
        url: `front/advert/gallery`,
        method: 'POST',
        params,
        headers: {
          currency
        },
        body: {
          category_id: body
        }
      }),
      invalidatesTags: ['all-ads-gallery']
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
        // params
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

export const {useAdsGalleryMutation, useGetSingleAdsGalleryQuery, useGetUserAdsGalleryQuery, useGetUserPromotionQuery} =
  ClipsEndpoint
