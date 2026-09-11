import {GetShippingConfigTopLevel} from '@/types/shipping'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['vendorApi', 'shipping configuration']
})

export const ShippingConfigurationEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    saveShippingConfiguration: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/store/shipping/save-method`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['vendorApi', 'shipping configuration']
    }),

    getShippingConfigurations: build.query<
      GetShippingConfigTopLevel,
      {
        userStore: string
      }
    >({
      query: arg => {
        const {userStore} = arg
        const params: {[key: string]: string} = {}

        return {
          url: `/store/shipping/${userStore}/methods`,
          method: 'GET',
          params
        }
      },
      providesTags: ['vendorApi', 'shipping configuration']
    }),

    removeShippingLocation: build.mutation<any, {locationId: number | string}>({
      query: ({locationId}) => ({
        url: `/store/shipping/delete-method/${locationId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['vendorApi', 'shipping configuration']
    }),

    removeShippingMethod: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/store/shipping/remove-method-type`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['vendorApi', 'shipping configuration']
    })
  }),
  overrideExisting: true
})

export const {
  useSaveShippingConfigurationMutation,
  useGetShippingConfigurationsQuery,
  useRemoveShippingLocationMutation,
  useRemoveShippingMethodMutation
} = ShippingConfigurationEndpoint
