import {BaseResponse} from '@/types/types'
import {api} from '../..'
import { IUserTransactionHistoryResponse } from '@/types/userTransactionHistory'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['all-clips', 'specified-store-listing', 'store-product-listing', 'all-clips-ById', 'all-wishlist']
})

interface ClipBody {
  quantity?: number
  variant_id?: number | undefined
}

export const ClipsEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getAllClips: build.query<BaseResponse, {currency: string}>({
      query: ({currency}) => ({
        url: `front/cart`,
        method: 'GET',
        headers: {
          currency
        }
      }),
      providesTags: ['all-clips']
    }),
    getUserOrder: build.query<IUserTransactionHistoryResponse, {order_status?: 'incart' | 'pending' | 'complete'}>({
      query: ({order_status}) => ({
        url: `front/order`,
        method: 'GET',
        params: {
          order_status: order_status !== undefined ? order_status : undefined
        }
      }),
      providesTags: ['all-clips']
    }),
    addToClips: build.mutation<any, {body: ClipBody; productSlug: string}>({
      query: ({body, productSlug}) => ({
        url: `front/cart/add/${productSlug}`,
        method: 'POST',
        body
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
    deleteProductFromClip: build.mutation<BaseResponse, {product: string | undefined; variant_id: number | undefined}>({
      query: ({product, variant_id}) => ({
        url: `front/cart/remove/${product}`,
        method: 'DELETE',
        params: {
          variant_id: variant_id !== undefined ? variant_id : undefined
        }
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
    editProductQuantity: build.mutation<BaseResponse, {product: string | undefined; body: ClipBody}>({
      query: ({product, body}) => ({
        url: `front/cart/edit/${product}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['all-clips']
    }),
    addToWishlistCart: build.mutation<any, {body: ClipBody; productSlug: string}>({
      query: ({body, productSlug}) => ({
        url: `front/wishlist/add-from-cart/${productSlug}`,
        method: 'POST',
        body
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
  useGetUserOrderQuery,
  useAddToClipsMutation,
  useGetClipsByIdQuery,
  useDeleteProductFromClipMutation,
  useDeleteClipMutation,
  useClipOrderMutation,
  useSendToVendorMutation,
  useServiceOrderMutation,
  useEditProductQuantityMutation,
  useAddToWishlistCartMutation,
  useGetAllWishlistsQuery,
  useAddToClipsWishlistMutation,
  useAddToWishlistMutation,
  useDeleteWishlistClipMutation
} = ClipsEndpoint
