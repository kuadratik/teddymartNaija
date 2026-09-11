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

    uploadImageFileSuperAdmin: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/file-upload`,
        method: 'POST',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['generalApi']
    }),

    uploadImageFileWithoutAuth: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/upload-file`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['generalApi']
    }),
    deleteImageFile: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/file-delete`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['generalApi']
    }),
    uploadVideoFile: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/video-file-upload`,
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
        country: string
      }
    >({
      query: arg => {
        const {uuid, country} = arg
        const params: {[key: string]: string} = {}

        return {
          url: `/front/stores/recommended-stores`,
          method: 'GET',
          headers: {
            interactUid: uuid,
            country
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
  useUploadImageFileSuperAdminMutation,
  useUploadVideoFileMutation,
  useDeleteImageFileMutation,
  useGetRecommendedStoresQuery,
  useGetPopularQuery,
  useContactUsMutation,
  useGetPopularNewQuery,
  useGetRecommendedStoresNewQuery,
  useUploadImageFileWithoutAuthMutation
} = GeneralEndpoint
