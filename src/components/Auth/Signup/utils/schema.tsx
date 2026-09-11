import * as Yup from 'yup'

export const signUpValidationSchema = Yup.object().shape({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  email: Yup.string().email('Email is Invalid').required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must be at most 15 characters'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Password must match')
    .required('Required')
})

export const otpValidationSchema = Yup.object({
  code: Yup.string().length(5, `OTP must be 5 characters long`).required('OTP is required')
})

export const StoreInformationSchema = Yup.object().shape({
  description: Yup.string().required('Required'),
  name: Yup.string().required('required'),
  whatsapp_number: Yup.number().required('Required'),
  contact_number: Yup.number().required('Required'),
  address1: Yup.string().required('required'),
  state: Yup.string().required('required'),
  country_id: Yup.string().required('required'),
  city: Yup.string().required('required')
})

export const OnboardingSchema = [
  Yup.object().shape({
    offers_product: Yup.boolean(),
    offers_service: Yup.boolean()
  }),
  StoreInformationSchema
]
