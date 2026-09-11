import {api} from '.'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Country']
})

export const countryStateApi = apiWithTag.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getCountry: builder.query({
      query: ({search}: {search: string}) => ({
        url: 'location/countries',
        method: 'GET',
        params: {
          search: search.toString()
        },
        providesTags: ['Country']
      })
    }),

    getState: builder.query({
      query: ({search, id}: {search: string; id: number}) => ({
        url: `location/countries/${id}/divisions`,
        method: 'GET',
        params: {
          search: search.toString()
        }
      })
    })
  })
})

export const {useGetCountryQuery, useGetStateQuery} = countryStateApi
