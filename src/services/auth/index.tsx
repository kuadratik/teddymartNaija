import {setCredentials} from '@/redux/apiSlice/authSlice'
import {setCookie} from 'nookies'
import {api} from '..'
import {
  ActiveUserLevel,
  BaseResponse,
  LoginRequestModel,
  MagicLinkModel,
  MagicLoginModel,
  SignUpRequestModel,
  TopLoginUserLevel,
  VerifyRequestModel
} from '../../types/types'

const apiWithTag = api.enhanceEndpoints({
  addTagTypes: ['authUser']
})

export const authApi = apiWithTag.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    login: builder.mutation<TopLoginUserLevel, LoginRequestModel>({
      query: body => ({
        url: 'front/login',
        method: 'POST',
        body: body
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled
          // Set the token in cookies
          setCookie(null, 'token', (data as any)?.data?.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
            sameSite: 'lax', // Recommended for security reasons
            secure: process.env.NODE_ENV !== 'development' // Only set secure cookies in production
          })

          // Store the token and user in localStorage
          // Correctly destructure the setter function from useLocalStorage
          dispatch(setCredentials({token: (data as any)?.data?.token, user: data?.data.user}))
        } catch (error) {
          // Handle error
        }
      }
    }),
    magicLogin: builder.mutation<TopLoginUserLevel, MagicLoginModel>({
      query: body => ({
        url: 'front/magic-login',
        method: 'POST',
        body: body
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled
          // Set the token in cookies
          setCookie(null, 'token', (data as any)?.data?.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
            sameSite: 'lax', // Recommended for security reasons
            secure: process.env.NODE_ENV !== 'development' // Only set secure cookies in production
          })

          // Store the token and user in localStorage
          // Correctly destructure the setter function from useLocalStorage
          dispatch(setCredentials({token: (data as any)?.data?.token, user: data?.data.user}))
        } catch (error) {
          // Handle error
        }
      }
    }),
    magicLink: builder.mutation<any, MagicLinkModel>({
      query: body => ({
        url: 'front/magic-link',
        method: 'POST',
        body
      })
    }),
    signUp: builder.mutation<BaseResponse, SignUpRequestModel>({
      query: body => ({
        url: 'front/register',
        method: 'POST',
        body
      })
    }),
    verify: builder.mutation<BaseResponse, VerifyRequestModel>({
      query: body => ({
        url: 'front/register/verify',
        method: 'POST',
        body
      })
    }),
    resendOtp: builder.mutation<BaseResponse, {email?: string}>({
      query: body => ({
        url: 'front/register/otp-resend',
        method: 'POST',
        body: {
          email: body.email
        }
      })
    }),
    forgetPasswordOtp: builder.mutation<BaseResponse, {email: string}>({
      query: body => ({
        url: 'front/reset/send-otp',
        method: 'POST',
        body: {
          email: body.email
        }
      })
    }),
    googleAuthVerify: builder.mutation<BaseResponse, {token: string}>({
      query: body => ({
        url: 'front/google-auth',
        method: 'POST',
        body: {
          token: body.token
        }
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled
          // Set the token in cookies
          setCookie(null, 'token', (data as any)?.data?.token, {
            maxAge: 30 * 24 * 60 * 60, // 30 days
            path: '/',
            sameSite: 'lax', // Recommended for security reasons
            secure: process.env.NODE_ENV !== 'development' // Only set secure cookies in production
          })

          // Store the token and user in localStorage
          // Correctly destructure the setter function from useLocalStorage
          dispatch(setCredentials({token: (data as any)?.data?.token, user: data?.data.user}))
        } catch (error) {
          // Handle error
        }
      }
    }),
    resetPassword: builder.mutation<
      BaseResponse,
      {email: string; new_password: string; otp: string; new_password_confirmation: string}
    >({
      query: body => ({
        url: 'front/reset',
        method: 'POST',
        body
      })
    }),

    activeUser: builder.query<ActiveUserLevel, any>({
      query: body => ({
        url: 'front/user/profile',
        method: 'GET'
      }),
      providesTags: ['authUser']
    })
  })
})

export const {
  useGoogleAuthVerifyMutation,
  useLoginMutation,
  useSignUpMutation,
  useActiveUserQuery,
  useVerifyMutation,
  useResendOtpMutation,
  useForgetPasswordOtpMutation,
  useMagicLinkMutation,
  useMagicLoginMutation,
  useResetPasswordMutation
} = authApi
