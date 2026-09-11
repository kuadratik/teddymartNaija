import {BaseResponse} from '@/types/types'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['generalApi']
})

export const GeneralEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    uploadImageFile: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/file-upload`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['generalApi']
    }),
    contactUs: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/contact-us`,
        method: 'POST',
        body
      })
    }),

    getRecommendedStores: build.query<
      any,
      {
        uuid: string
      }
    >({
      query: arg => {
        const {uuid} = arg
        const params: {[key: string]: string} = {}

        return {
          url: `/front/stores/recommended-stores`,
          method: 'GET',
          headers: {
            interactUid: uuid
          }
        }
      },
      providesTags: ['generalApi']
    }),
    getRecommendedStoresNew: build.query<
      any,
      {
        uuid: string
        currency: string
      }
    >({
      query: arg => {
        const {uuid, currency} = arg
        const params: {[key: string]: string} = {}

        return {
          url: `/front/stores/recommended-stores`,
          method: 'GET',
          headers: {
            interactUid: uuid,
            currency
          }
        }
      },
      providesTags: ['generalApi']
    }),
    getPopular: build.query<BaseResponse, {listingType?: string | undefined}>({
      query: ({listingType}) => ({
        url: `front/stores/listing/popular?listingType=${listingType}`,
        method: 'GET'
      })
    }),
    getPopularNew: build.query<BaseResponse, {listingType?: string | undefined; currency: string | undefined}>({
      query: ({listingType, currency}) => ({
        url: `front/stores/listing/popular?listingType=${listingType}`,
        method: 'GET',
        headers: {
          currency
        }
      })
    })
  }),

  overrideExisting: true
})

export const {
  useUploadImageFileMutation,
  useGetRecommendedStoresQuery,
  useGetPopularQuery,
  useContactUsMutation,
  useGetPopularNewQuery,
  useGetRecommendedStoresNewQuery
} = GeneralEndpoint
