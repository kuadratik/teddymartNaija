import {BaseResponse} from '@/types/types'
import {api} from '..'
import {SpecifiedStoreModel, SpecifiedStoreQueryParams} from '@/types/store'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: [
    'all-clips',
    'specified-store-listing',
    'store-product-listing',
    'all-clips-ById',
    'cart',
    'all-wishlist'
  ]
})

export const ClipsEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getAllClips: build.query<BaseResponse, {currency?: string}>({
      query: ({currency}) => ({
        url: `front/clips`,
        method: 'GET',
        headers: {
          currency
        }
      }),
      providesTags: (result, error, {currency}) => [{type: 'cart', currency}, {type: 'all-clips'}]
    }),
    addToClips: build.mutation<any, {body: string}>({
      query: ({body}) => ({
        url: `front/add-to-clip/${body}`,
        method: 'POST'
      }),
      invalidatesTags: ['all-clips', 'specified-store-listing', 'store-product-listing']
    }),
    getClipsById: build.query<BaseResponse, {clip_id?: string | undefined; currency: string}>({
      query: ({clip_id, currency}) => ({
        url: `front/clip/${clip_id}`,
        method: 'GET',
        headers: {
          currency
        }
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
    }),
    serviceOrder: build.mutation<BaseResponse, {store_id: string | undefined; listing_id: string | undefined}>({
      query: ({store_id, listing_id}) => ({
        url: `front/store/${store_id}/service/${listing_id}/order`,
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
    getAllWishlists: build.query<BaseResponse, any>({
      query: () => ({
        url: `front/wishlist`,
        method: 'GET'
      }),
      providesTags: ['all-wishlist']
    }),
    addToWishlist: build.mutation<any, {product: string}>({
      query: ({product}) => ({
        url: `front/wishlist/add/${product}`,
        method: 'POST'
      }),
      invalidatesTags: ['all-wishlist']
    }),
    addToClipsWishlist: build.mutation<any, {product: string}>({
      query: ({product}) => ({
        url: `front/wishlist/add-to-cart/${product}`,
        method: 'POST'
      }),
      invalidatesTags: ['all-clips', 'specified-store-listing', 'store-product-listing', 'all-wishlist']
    }),
    deleteWishlistClip: build.mutation<BaseResponse, {product: string | undefined}>({
      query: ({product}) => ({
        url: `front/wishlist/remove/${product}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['all-clips', 'all-clips-ById', 'all-wishlist']
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
  useAddToWishlistCartMutation,
  useGetAllWishlistsQuery,
  useAddToWishlistMutation,
  useAddToClipsWishlistMutation,
  useDeleteWishlistClipMutation
} = ClipsEndpoint
