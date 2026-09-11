import {BaseResponse} from '@/types/types'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: [
    'all-adverts',
    'user-adverts',
    'advert-gallery',
    'advert-plans',
    'all-promoted-stores',
    'promotion-plans'
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
    updateAdvert: build.mutation<any, {body: any; currency: string; advert: number}>({
      query: ({body, currency, advert}) => ({
        url: `front/advert/${advert}/update`,
        method: 'PUT',
        body,
        headers: {
          currency
        }
      }),
      invalidatesTags: ['all-adverts', 'user-adverts', 'advert-gallery']
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
  useGetPromotionsPlansQuery,
  useUpdateAdvertMutation,
  useUpdateStorePromotionMutation
} = AdvertEndpoint
