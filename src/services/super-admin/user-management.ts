import {
  ICreateAdminStaffRequest,
  IStaffManagementDetailResponse,
  IStaffManagementResponse,
  SuperAdminProfileResponse,
  UserPermissionsResponse
} from '@/types/super-admin/user-management'
import {api} from '..'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['superUserManagementApi']
})

export const SuperUserManagementEndpoint = apiWithTag.injectEndpoints({
  endpoints: build => ({
    getAllAdminStaffs: build.query<
      IStaffManagementResponse,
      {page?: number; search?: string; active?: boolean; per_page?: number; role?: string} | void
    >({
      query: args => {
        const page = args && 'page' in args ? args.page : 1
        const search = args && 'search' in args ? args.search : undefined
        const active = args && 'active' in args ? args.active : undefined
        const perPage = args && 'per_page' in args ? args.per_page : undefined
        const role = args && 'role' in args ? args.role : undefined
        const params: Record<string, any> = {
          page: page || 1
        }

        if (search) params.search = search
        if (active !== undefined) params.active = active
        if (perPage) params.per_page = perPage
        if (role) params.role = role

        return {
          url: `/admin/staff`,
          method: 'GET',
          params,
          headers: {
            'X-Auth-Type': 'super-admin'
          }
        }
      },
      providesTags: ['superUserManagementApi']
    }),
    // get single admin staff details
    getAdminStaffDetails: build.query<IStaffManagementDetailResponse, {adminStaffId: string}>({
      query: ({adminStaffId}) => ({
        url: `/admin/staff/${adminStaffId}/details`,
        method: 'GET',
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      providesTags: ['superUserManagementApi']
    }),
    getAdminStaffProfile: build.query<SuperAdminProfileResponse, any>({
      query: () => ({
        url: `/admin/profile`,
        method: 'GET',
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      providesTags: ['superUserManagementApi']
    }),
    // get all permissions
    getAllPermissions: build.query<UserPermissionsResponse, void>({
      query: () => ({
        url: `/admin/permissions`,
        method: 'GET',
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      providesTags: ['superUserManagementApi']
    }),
    // Create a new brand category
    createAdminStaff: build.mutation<
      any,
      {
        body: ICreateAdminStaffRequest
      }
    >({
      query: ({body}) => ({
        url: `/admin/staff/create`,
        method: 'POST',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superUserManagementApi']
    }),
    createAdminStaffProfile: build.mutation<
      any,
      {
        body: {
          first_name: string
          last_name: string
          email: string
        }
      }
    >({
      query: ({body}) => ({
        url: `/admin/profile-update`,
        method: 'POST',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superUserManagementApi']
    }),
    createAdminStaffPassword: build.mutation<
      any,
      {
        body: {
          old_password: string
          password: string
          password_confirmation: string
        }
      }
    >({
      query: ({body}) => ({
        url: `/admin/password-update`,
        method: 'POST',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superUserManagementApi']
    }),

    // Update a admin staff
    updateAdminStaff: build.mutation<any, {adminStaffId: string; body: ICreateAdminStaffRequest}>({
      query: ({adminStaffId, body}) => ({
        url: `/admin/staff/${adminStaffId}/update`,
        method: 'PUT',
        body,
        headers: {
          'X-Auth-Type': 'super-admin'
        }
      }),
      invalidatesTags: ['superUserManagementApi']
    }),

    // Delete an admin staff
    deleteAdminStaff: build.mutation<any, {adminStaffId: number}>({
      query: ({adminStaffId}) => ({
        url: `/admin/staff/${adminStaffId}/delete`,
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
  useGetAllAdminStaffsQuery,
  useGetAdminStaffDetailsQuery,
  useGetAllPermissionsQuery,
  useGetAdminStaffProfileQuery,
  useCreateAdminStaffMutation,
  useCreateAdminStaffProfileMutation,
  useCreateAdminStaffPasswordMutation,
  useUpdateAdminStaffMutation,
  useDeleteAdminStaffMutation
} = SuperUserManagementEndpoint
