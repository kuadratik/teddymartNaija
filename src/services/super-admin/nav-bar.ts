import {ICreateNavBarRequest, INavBarListResponse} from '@/types/super-admin/nav-bar'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['superAdminNavBarApi']
})

export const SuperAdminNavBarEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    // Get all brand categories
    getAllNavigation: build.query<INavBarListResponse, {type?: 'bottom' | 'top'} | void>({
      query: args => {
        const params: Record<string, any> = {}
        const type = args && 'type' in args ? args.type : undefined
        if (type !== undefined) params.type = type
        return {
          url: `/admin/navigations`,
          method: 'GET',
          params,
          headers: {
            'X-Auth-Type': 'super-admin'
          }
        }
      },
      providesTags: ['superAdminNavBarApi']
    }),

    // Create a new brand category
    createNavigation: build.mutation<any, ICreateNavBarRequest>({
      query: body => ({
        url: `/admin/navigations/create`,
        method: 'POST',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superAdminNavBarApi']
    }),

    // Update a brand
    updateNavigation: build.mutation<any, {navigationId: string; body: ICreateNavBarRequest}>({
      query: ({navigationId, body}) => ({
        url: `/admin/navigations/${navigationId}/update`,
        method: 'PUT',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superAdminNavBarApi']
    }),

    // Get slug recommendation
    deleteNavigation: build.mutation<any, {navigationId: string}>({
      query: ({navigationId}) => ({
        url: `/admin/navigations/${navigationId}/delete`,
        method: 'DELETE',
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      })
    })
  }),

  overrideExisting: true
})

export const {
  useGetAllNavigationQuery,
  useCreateNavigationMutation,
  useUpdateNavigationMutation,
  useDeleteNavigationMutation
} = SuperAdminNavBarEndpoint
