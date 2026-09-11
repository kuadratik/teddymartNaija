import {BaseResponse} from '@/types/types'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['all-adverts', 'user-ads-gallery', 'user-promotion']
})

export const PaymentEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    verifyPayment: build.mutation<any, {token: any; gateway: string}>({
      query: ({token, gateway}) => ({
        url: `front/payment/${gateway}/verify`,
        method: 'POST',
        body: {token: token}
      }),
      invalidatesTags: ['user-ads-gallery', 'user-promotion']
    })
  }),
  overrideExisting: true
})

export const {useVerifyPaymentMutation} = PaymentEndpoint
