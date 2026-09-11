import {BaseResponse} from '@/types/types'
import {api} from '..'
import {SpecifiedStoreModel, SpecifiedStoreQueryParams} from '@/types/store'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: [
    'Cart',
    'all-clips',
    'specified-store-listing',
    'store-product-listing',
    'all-clips-ById',
    'all-wishlist'
  ]
})

export const ClipsEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getAllClips: build.query<BaseResponse, {currency?: string}>({
      query: ({currency}) => ({
        url: `front/cart`,
        method: 'GET',
        headers: {
          currency
        }
      }),
      providesTags: (result, error, {currency}) => [{type: 'Cart', currency}, {type: 'all-clips'}]
      // providesTags: ['all-clips']
    }),
    editProductQuantity: build.mutation<BaseResponse, {product: string | undefined; body: any}>({
      query: ({product, body}) => ({
        url: `front/cart/edit/${product}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['all-clips']
    }),
    addToClips: build.mutation<any, {body: string}>({
      query: ({body}) => ({
        url: `front/cart/add/${body}`,
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
    deleteProductFromClip: build.mutation<BaseResponse, {product: string | undefined}>({
      query: ({product}) => ({
        url: `front/cart/remove/${product}`,
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
    }),
    addToWishlistCart: build.mutation<any, {product: string}>({
      query: ({product}) => ({
        url: `front/wishlist/add-from-cart/${product}`,
        method: 'POST'
      }),
      invalidatesTags: ['all-wishlist']
    }),
    serviceOrder: build.mutation<BaseResponse, {store_id: string | undefined; listing_id: string | undefined}>({
      query: ({store_id, listing_id}) => ({
        url: `front/store/${store_id}/service/${listing_id}/order`,
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
  useSendToVendorMutation,
  useServiceOrderMutation,
  useEditProductQuantityMutation,
  useAddToWishlistCartMutation
} = ClipsEndpoint
