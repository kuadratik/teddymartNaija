import * as Yup from 'yup'

export const signUpValidationSchema = Yup.object().shape({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  email: Yup.string().email('Email is Invalid').required('Required'),
  refferalCode: Yup.string().nullable().optional(),
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
  name: Yup.string().required('Required'),
  categories: Yup.array().of(Yup.number()).min(1, 'At least one category is required'),
  description: Yup.string().required('Required'),
  contact_number: Yup.number().required('Required'),
  whatsapp_number: Yup.number().required('Required'),
  address1: Yup.string().required('Required'),
  address2: Yup.string(),
  country: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  postal_code: Yup.string()
})
export const StoreInformationProfileSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  categories: Yup.array().of(Yup.number()).min(1, 'At least one category is required'),
  description: Yup.string().required('Required'),
  contact_number: Yup.number().required('Required'),
  whatsapp_number: Yup.number().required('Required'),
  address1: Yup.string().required('Required'),
  address2: Yup.string(),
  country_id: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  postal_code: Yup.string()
})

export const UploadInformationSchema = Yup.object().shape({
  profile_picture_path: Yup.mixed().test('is-required', 'Profile picture is required', function (value) {
    const {id} = this.parent
    // If editing an existing store (id exists), allow null/undefined
    if (id) {
      return true
    }
    // For new stores, require a value
    return value != null && value !== undefined
  }),
  banner_path: Yup.mixed().test('is-required', 'Store banner is required', function (value) {
    const {id} = this.parent
    // If editing an existing store (id exists), allow null/undefined
    if (id) {
      return true
    }
    // For new stores, require a value
    return value != null && value !== undefined
  })
})

export const OnboardingSchema = [
  Yup.object().shape({
    offers_product: Yup.boolean(),
    offers_service: Yup.boolean()
  }),
  StoreInformationSchema,
  UploadInformationSchema
]

export const NewStoreSchema = [StoreInformationSchema, UploadInformationSchema]
