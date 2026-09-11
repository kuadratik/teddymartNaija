import {BaseResponse} from '@/types/types'
import {api} from '..'
import {SpecifiedStoreModel, SpecifiedStoreQueryParams} from '@/types/store'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['all-clips', 'specified-store-listing', 'store-product-listing', 'all-clips-ById']
})

export const ClipsEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getAllClips: build.query<BaseResponse, any>({
      query: () => ({
        url: `front/clips`,
        method: 'GET'
      }),
      providesTags: ['all-clips']
    }),
    addToClips: build.mutation<any, {body: string}>({
      query: ({body}) => ({
        url: `front/add-to-clip/${body}`,
        method: 'POST'
      }),
      invalidatesTags: ['all-clips', 'specified-store-listing', 'store-product-listing']
    }),
    getClipsById: build.query<BaseResponse, {clip_id?: string | undefined}>({
      query: ({clip_id}) => ({
        url: `front/clip/${clip_id}`,
        method: 'GET'
      }),
      providesTags: ['all-clips-ById']
    }),
    deleteProductFromClip: build.mutation<BaseResponse, {clip_id: string | undefined; product_id: string | undefined}>({
      query: ({clip_id, product_id}) => ({
        url: `front/clips/${clip_id}/items/${product_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['all-clips', 'all-clips-ById']
    }),
    deleteClip: build.mutation<BaseResponse, {clip_id: string | undefined}>({
      query: ({clip_id}) => ({
        url: `front/clips/${clip_id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['all-clips', 'all-clips-ById']
    }),
    clipOrder: build.mutation<BaseResponse, {clip_id: string | undefined; body: any}>({
      query: ({clip_id, body}) => ({
        url: `front/clip/${clip_id}/order`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['all-clips']
    }),
    sendToVendor: build.mutation<BaseResponse, {order_id: string | undefined}>({
      query: ({order_id}) => ({
        url: `front/clip/${order_id}/send-to-vendor`,
        method: 'POST'
      }),
      invalidatesTags: ['all-clips']
    })
  }),
  overrideExisting: true
})

export const {
  useGetAllClipsQuery,
  useAddToClipsMutation,
  useGetClipsByIdQuery,
  useDeleteProductFromClipMutation,
  useDeleteClipMutation,
  useClipOrderMutation,
  useSendToVendorMutation
} = ClipsEndpoint
