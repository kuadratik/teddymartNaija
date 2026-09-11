import {OrderHistoryTopLevel} from '@/types/order'
import {api} from '../index'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['rating', 'order']
})

export const RatingEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getOrderHistory: build.query<
      OrderHistoryTopLevel,
      {
        per_page?: number
        page?: number
        current_page?: number
        search?: string
        currency: string
      }
    >({
      query: arg => {
        const {page, current_page, per_page, search, currency} = arg
        const params: {[key: string | number]: string | number} = {
          per_page: per_page?.toString() ?? '1',
          search: search!
        }

        if (currency) params.currency = currency

        return {
          url: `/front/order-history`,
          method: 'GET',
          headers: {
            currency
          },
          params
        }
      },
      providesTags: ['order']
    }),

    getOrderHistoryServices: build.query<
      any,
      {
        per_page?: number
        page?: number
        current_page?: number
        search?: string
        currency: string
      }
    >({
      query: arg => {
        const {page, current_page, per_page, search, currency} = arg
        const params: {[key: string | number]: string | number} = {
          per_page: per_page?.toString() ?? '1',
          search: search!
        }

        if (currency) params.currency = currency

        return {
          url: `/front/service-history`,
          method: 'GET',
          headers: {
            currency
          },
          params
        }
      },
      providesTags: ['order']
    }),

    getAllRatings: build.query<
      any,
      {
        from?: string
        to?: string
        page?: string
        product?: string
        userStore: string
      }
    >({
      query: arg => {
        const {from, to, page, product, userStore} = arg
        const params: {[key: string]: string} = {
          page: page?.toString() ?? '1',
          product: product!
        }

        return {
          url: `/store/${userStore}/ratings`,
          method: 'GET',
          params
        }
      },
      providesTags: ['rating']
    }),

    addRate: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/store/listings/add-rating`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['rating']
    }),

    receiveOrder: build.mutation<any, {orderId: string}>({
      query: ({orderId}) => ({
        url: `/front/${orderId}/recieve-order`,
        method: 'PATCH'
      }),
      invalidatesTags: ['order']
    })
  }),
  overrideExisting: true
})

export const {
  useGetOrderHistoryQuery,
  useGetAllRatingsQuery,
  useAddRateMutation,
  useReceiveOrderMutation,
  useGetOrderHistoryServicesQuery
} = RatingEndpoint
