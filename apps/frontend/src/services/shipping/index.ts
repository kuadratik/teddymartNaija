import {IStoreMethodsTopLevel} from '@/types/shippingResponse'
import {BaseResponse} from '@/types/types'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['all-shipping-address']
})

export const ShippingEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getAllShippingAddress: build.query<BaseResponse, any>({
      query: () => ({
        url: `front/user/shipping-address`,
        method: 'GET'
      }),
      providesTags: ['all-shipping-address']
    }),
    getShippingMethods: build.query<IStoreMethodsTopLevel, {clipId: string; currency: string}>({
      query: ({clipId, currency}) => ({
        url: `/front/cart/${clipId}/shipping/methods`,
        method: 'GET',
        headers: {
          currency
        }
      }),
      providesTags: ['all-shipping-address']
    }),
    addToShippingAddress: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `front/user/shipping-address/create`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['all-shipping-address']
    }),
    updateShippingAddress: build.mutation<any, {body: any; shippingAddressId: string}>({
      query: ({body, shippingAddressId}) => ({
        url: `/front/user/shipping-address/${shippingAddressId}/edit`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['all-shipping-address']
    }),
    createPayment: build.mutation<any, {cart: string; currency: string; body: any}>({
      query: ({body, cart, currency}) => ({
        url: `/front/cart/${cart}/payment`,
        method: 'POST',
        body,
        headers: {
          currency
        }
      }),
      invalidatesTags: ['all-shipping-address']
    }),
    deleteShippingAddress: build.mutation<any, {shippingAddressId: number | string}>({
      query: ({shippingAddressId}) => ({
        url: `front/user/shipping-address/${shippingAddressId}/delete`,
        method: 'DELETE'
      }),
      invalidatesTags: ['all-shipping-address']
    })
  }),
  overrideExisting: true
})

export const {
  useGetAllShippingAddressQuery,
  useAddToShippingAddressMutation,
  useGetShippingMethodsQuery,
  useCreatePaymentMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation
} = ShippingEndpoint
