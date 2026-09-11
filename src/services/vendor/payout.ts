import {PayoutDetailTopLevel} from '@/types/store'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['vendorApi', 'payout']
})

export const PayoutEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    savePayoutDetail: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/store/payout/save-detail`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['vendorApi', 'payout']
    }),

    updatePayoutDetail: build.mutation<any, {body: any; storePayoutDetailId: string | number}>({
      query: ({body, storePayoutDetailId}) => ({
        url: `/store/payout/update-detail/${storePayoutDetailId}`,
        method: 'PATCH',
        body: {...body}
      }),
      invalidatesTags: ['vendorApi', 'payout']
    }),

    getPayoutDetails: build.query<
      PayoutDetailTopLevel,
      {
        userStore: string
      }
    >({
      query: arg => {
        const {userStore} = arg
        const params: {[key: string]: string} = {}

        return {
          url: `/store/payout/${userStore}/payout-details`,
          method: 'GET',
          params
        }
      },
      providesTags: ['vendorApi', 'payout']
    }),

    deletePayoutDetail: build.mutation<any, {storePayoutDetailId: number | string}>({
      query: ({storePayoutDetailId}) => ({
        url: `/store/payout/delete-detail/${storePayoutDetailId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['vendorApi', 'payout']
    }),

    getAllRequestedPayout: build.query<
      any,
      {
        from?: string
        to?: string
        page?: string
        search?: string
        userStore?: string
      }
    >({
      query: arg => {
        const {from, userStore, to, page, search} = arg
        const params: {[key: string]: string} = {
          page: page?.toString() ?? '1',
          search: search!
        }
        if (from) params.from = from
        if (to) params.to = to

        return {
          url: `/store/payout/${userStore}/requestable-payouts`,
          method: 'GET',
          params
        }
      },
      providesTags: ['payout']
    }),

    getProcessedPayout: build.query<
      any,
      {
        from?: string
        to?: string
        page?: string
        search?: string
        userStore?: string
      }
    >({
      query: arg => {
        const {from, userStore, to, page, search} = arg
        const params: {[key: string]: string} = {
          page: page?.toString() ?? '1',
          search: search!
        }
        if (from) params.from = from
        if (to) params.to = to

        return {
          url: `/store/payout/${userStore}/processed-payouts`,
          method: 'GET',
          params
        }
      },
      providesTags: ['payout']
    }),

    requestPayout: build.mutation<any, {userStore: string; payout: number | string}>({
      query: ({userStore, payout}) => ({
        url: `/store/payout/${userStore}/store/${payout}/payout`,
        method: 'PATCH'
      }),
      invalidatesTags: ['vendorApi', 'payout']
    }),
    activatePayoutDetails: build.mutation<any, {userStore: string; storePayoutDetailId: number | string}>({
      query: ({userStore, storePayoutDetailId}) => ({
        url: `/store/payout/${userStore}/store/${storePayoutDetailId}/set-default`,
        method: 'PATCH'
      }),
      invalidatesTags: ['vendorApi', 'payout']
    })
  }),
  overrideExisting: true
})

export const {
  useDeletePayoutDetailMutation,
  useSavePayoutDetailMutation,
  useGetPayoutDetailsQuery,
  useUpdatePayoutDetailMutation,
  useGetAllRequestedPayoutQuery,
  useGetProcessedPayoutQuery,
  useRequestPayoutMutation,
  useActivatePayoutDetailsMutation
} = PayoutEndpoint
