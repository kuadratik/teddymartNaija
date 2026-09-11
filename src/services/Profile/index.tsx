import {setCredentials} from '@/redux/apiSlice/authSlice'
import {setCookie} from 'nookies'
import {api} from '..'
import {BaseResponse, LoginRequestModel, SignUpRequestModel, TopLoginUserLevel} from '../../types/types'
import {VendorPasswordType, VendorPersonalType, VendorStoreInformationType} from '@/components/Profile/utils'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['authUser']
})

export const authApi = apiWithTag.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    updateProfile: builder.mutation<BaseResponse, VendorPersonalType>({
      query: body => ({
        url: 'front/user/profile/update',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['authUser']
    }),
    changePassword: builder.mutation<BaseResponse, VendorPasswordType>({
      query: body => ({
        url: 'front/user/change-password',
        method: 'PATCH',
        body
      })
    }),
    updateStoreInformation: builder.mutation<BaseResponse, VendorStoreInformationType>({
      query: body => ({
        url: `store/${body.slug}/update`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['authUser']
    })
  })
})

export const {useUpdateProfileMutation, useChangePasswordMutation, useUpdateStoreInformationMutation} = authApi
