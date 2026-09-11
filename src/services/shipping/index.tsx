import {BaseResponse} from '@/types/types'
import {api} from '..'
import {SpecifiedStoreModel, SpecifiedStoreQueryParams} from '@/types/store'

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
    addToShippingAddress: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `front/user/shipping-address/create`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['all-shipping-address']
    })
  }),
  overrideExisting: true
})

export const {useGetAllShippingAddressQuery, useAddToShippingAddressMutation} = ShippingEndpoint
