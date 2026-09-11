import * as Yup from 'yup'

export const signUpValidationSchema = Yup.object().shape({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  email: Yup.string().email('Email is Invalid').required('Required'),
  password: Yup.string()
    .required('Required')
    .matches(/[a-z]/, 'The password must contain at least one lowercase letter.')
    .matches(/[A-Z]/, 'The password must contain at least one uppercase letter.')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'The password must contain at least one symbol.')
    .matches(/[a-zA-Z]/, 'The password must contain at least one letter.'),
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
  country: Yup.string().required('required'),
  city: Yup.string().required('required')
})

export const OnboardingSchema = [
  Yup.object().shape({
    offers_product: Yup.boolean(),
    offers_service: Yup.boolean()
  }),
  StoreInformationSchema
]

export const NewStoreSchema = [StoreInformationSchema]
