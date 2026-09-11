import {BusinessListingTopLevel} from '@/types/business'
import {api} from '.'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Business-listing']
})

export const BusinessEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    businessListings: build.query<
      BusinessListingTopLevel,
      {
        search?: string
        industry?: number[]
        per_page?: number
        page?: number
        current_page?: number
      }
    >({
      query: arg => {
        const {page, search, industry, per_page, current_page} = arg
        const params: {[key: string | number]: string | number} = {
          page: page?.toString() ?? '1',
          search: search!,
          industry: industry?.toString() ?? ''
        }

        return {
          url: `/front/business-listings`,
          method: 'GET',
          params
        }
      },
      providesTags: ['Business-listing']
    }),

    createBusinessListing: build.mutation<any, {body: any}>({
      query: ({body}) => ({
        url: `/front/business-listings/create`,
        method: 'POST',
        body: {...body}
      }),
      invalidatesTags: ['Business-listing']
    })
  }),
  overrideExisting: true
})

export const {useBusinessListingsQuery, useCreateBusinessListingMutation} = BusinessEndpoint
