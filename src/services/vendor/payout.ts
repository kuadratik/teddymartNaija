import {IBankResponse} from '@/types/bankTypes'
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
    getAllPaystackBanks: build.query<
      IBankResponse,
      {
        payment_gateway: string
        search?: string
        next?: string
        previous?: string
        per_page?: string
      }
    >({
      query: arg => {
        const {payment_gateway, per_page, search, next, previous} = arg
        const params: {[key: string]: string} = {
          per_page: per_page?.toString() ?? '150',
          search: search!
        }
        if (payment_gateway) params.payment_gateway = payment_gateway
        if (next) params.next = next
        if (previous) params.previous = previous

        return {
          url: `/store/payout/list-banks`,
          method: 'GET',
          params
        }
      },
      providesTags: ['payout']
    }),
    getValidatedBankDetails: build.query<
      any,
      {
        payment_gateway: string
        account_number: string
        bank_code: string
      }
    >({
      query: arg => {
        const {payment_gateway, account_number, bank_code} = arg
        const params: {[key: string]: string} = {}
        if (payment_gateway) params.payment_gateway = payment_gateway
        if (account_number) params.account_number = account_number
        if (bank_code) params.bank_code = bank_code

        return {
          url: `/store/payout/validate-bank-details`,
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
        // url: `/store/payout/${userStore}/store/${payout}/payout`,
        url: `/store/payout/${userStore}/store/${payout}/process-payout`,
        method: 'PATCH'
      }),
      invalidatesTags: ['vendorApi', 'payout']
    }),
    requestPayoutOTP: build.mutation<any, {userStore: string}>({
      query: ({userStore}) => ({
        url: `/store/payout/${userStore}/send-otp`,
        method: 'POST'
      }),
      invalidatesTags: ['vendorApi', 'payout']
    }),

    verifyPayoutOTP: build.mutation<
      any,
      {
        body: {
          otp: string
        }
        userStore: string
      }
    >({
      query: ({body, userStore}) => ({
        url: `/store/payout/${userStore}/verify-otp`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['vendorApi', 'payout']
    }),
    confirmAuth: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/auth-confirmation`,
        method: 'POST',
        body: {...body}
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
  useGetAllPaystackBanksQuery,
  useGetValidatedBankDetailsQuery,
  useUpdatePayoutDetailMutation,
  useGetAllRequestedPayoutQuery,
  useGetProcessedPayoutQuery,
  useRequestPayoutMutation,
  useActivatePayoutDetailsMutation,
  useConfirmAuthMutation,
  useRequestPayoutOTPMutation,
  useVerifyPayoutOTPMutation
} = PayoutEndpoint
