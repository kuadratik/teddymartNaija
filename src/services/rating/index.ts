import {BusinessListingTopLevel} from '@/types/business'
import {api} from '../index'
import {OrderHistoryTopLevel} from '@/types/order'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['rating']
})

export const RatingEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getOrderHistory: build.query<
      OrderHistoryTopLevel,
      {
        from?: string
        to?: string
        page?: string
        search?: string
      }
    >({
      query: arg => {
        const {from, to, page, search} = arg
        const params: {[key: string]: string} = {
          page: page?.toString() ?? '1',
          search: search!
        }
        if (from) params.from = from
        if (to) params.to = to

        return {
          url: `/front/order-history`,
          method: 'GET',
          params
        }
      },
      providesTags: ['rating']
    }),

    getAllRatings: build.query<
      any,
      {
        from?: string
        to?: string
        page?: string
        search?: string
        userStore: string
      }
    >({
      query: arg => {
        const {from, to, page, search, userStore} = arg
        const params: {[key: string]: string} = {
          page: page?.toString() ?? '1',
          search: search!
        }
        if (from) params.from = from
        if (to) params.to = to

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
    })
  }),
  overrideExisting: true
})

export const {useGetOrderHistoryQuery, useGetAllRatingsQuery, useAddRateMutation} = RatingEndpoint
