import {IAdvertRatingsTopLevel, IAdvertWishlistTopLevel} from '@/types/advertWishlist'
import {BaseResponse} from '@/types/types'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: [
    'all-adverts',
    'user-adverts',
    'advert-gallery',
    'advert-plans',
    'all-promoted-stores',
    'promotion-plans',
    'all-ads-gallery',
    'user-ads-gallery',
    'advert-wishlist',
    'advert-ratings'
  ]
})

export const AdvertEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    createAdvert: build.mutation<any, {body: any; currency: string}>({
      query: ({body, currency}) => ({
        url: `front/advert/create`,
        method: 'POST',
        body,
        headers: {
          currency
        }
      }),
      invalidatesTags: ['all-adverts', 'user-adverts', 'advert-gallery']
    }),
    updateAdvert: build.mutation<any, {body: any; currency: string; advert: number | string}>({
      query: ({body, currency, advert}) => ({
        url: `front/advert/${advert}/update`,
        method: 'PUT',
        body,
        headers: {
          currency
        }
      }),
      invalidatesTags: ['all-adverts', 'user-adverts', 'advert-gallery', 'all-ads-gallery']
    }),
    getAdvertWishlist: build.query<IAdvertWishlistTopLevel, {currency: string; search?: string}>({
      query: ({currency, search}) => ({
        url: `front/wishlist/advert`,
        method: 'GET',
        params: {
          ...(search && {search}) // Only include search if it exists and is not empty
        },
        // headers: {
        //   currency
        // },
        providesTags: ['advert-wishlist']
      })
    }),
    addAdvertToWishlist: build.mutation<any, {body: any; advert_id: string | number}>({
      query: ({body, advert_id}) => ({
        url: `front/wishlist/advert/add/${advert_id}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['all-adverts', 'user-adverts', 'advert-gallery']
    }),
    rateThisAdvert: build.mutation<
      any,
      {body: {rating: number; name: string; review?: string}; advert_id: string | number}
    >({
      query: ({body, advert_id}) => ({
        url: `front/advert/${advert_id}/rate`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['all-adverts', 'user-adverts', 'advert-gallery', 'advert-ratings']
    }),
    getAllRatedAdvert: build.query<IAdvertRatingsTopLevel, {advert_id: string | number}>({
      query: ({advert_id}) => ({
        url: `front/advert/${advert_id}/ratings`,
        method: 'GET',
        providesTags: ['advert-ratings']
      })
    }),
    deleteAdvertWishlist: build.mutation<any, {advert_id: number | string}>({
      query: ({advert_id}) => ({
        url: `front/wishlist/advert/remove/${advert_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['advert-wishlist']
    }),
    getAdvertPlans: build.query<BaseResponse, {currency: string}>({
      query: ({currency}) => ({
        url: `front/advert/plans`,
        method: 'GET',
        headers: {
          currency
        },
        providesTags: ['advert-plans']
      })
    }),
    deleteAdvert: build.mutation<any, {adsGalleryId: number | string}>({
      query: ({adsGalleryId}) => ({
        url: `front/advert/${adsGalleryId}/delete`,
        method: 'DELETE'
      }),
      invalidatesTags: ['all-adverts', 'all-ads-gallery', 'user-ads-gallery']
    }),
    createStorePromotion: build.mutation<any, {body: any; currency: string}>({
      query: ({body, currency}) => ({
        url: `store/advert/promote`,
        method: 'POST',
        body,
        headers: {
          currency
        }
      }),
      invalidatesTags: ['all-promoted-stores']
    }),
    updateStorePromotion: build.mutation<any, {body: any; currency: string}>({
      query: ({body, currency}) => ({
        url: `store/advert/promote/update`,
        method: 'PUT',
        body,
        headers: {
          currency
        }
      }),
      invalidatesTags: ['all-promoted-stores']
    }),
    getPromotionsPlans: build.query<BaseResponse, {currency: string}>({
      query: ({currency}) => ({
        url: `front/advert/promoted-plans`,
        method: 'GET',
        headers: {
          currency
        },
        providesTags: ['promotion-plans']
      })
    }),
    getAllPromotedStores: build.query<BaseResponse, {currency: string}>({
      query: ({currency}) => ({
        url: `front/advert/store/promote`,
        method: 'GET',
        headers: {
          currency
        },
        providesTags: ['all-promoted-stores']
      })
    })
  }),
  overrideExisting: true
})

export const {
  useCreateAdvertMutation,
  useGetAdvertPlansQuery,
  useCreateStorePromotionMutation,
  useGetAllPromotedStoresQuery,
  useDeleteAdvertMutation,
  useGetPromotionsPlansQuery,
  useUpdateAdvertMutation,
  useUpdateStorePromotionMutation,
  useGetAdvertWishlistQuery,
  useAddAdvertToWishlistMutation,
  useDeleteAdvertWishlistMutation,
  useRateThisAdvertMutation,
  useGetAllRatedAdvertQuery
} = AdvertEndpoint
