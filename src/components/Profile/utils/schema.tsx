import * as Yup from 'yup'

export const vendorPersonalInfoValidationSchema = Yup.object().shape({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  email: Yup.string().email('Email is Invalid').required('Required')
})

export const vendorPasswordValidationSchema = Yup.object().shape({
  old_password: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must be at most 15 characters'),
  new_password: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must be at most 15 characters'),
  new_password_confirmation: Yup.string()
    .oneOf([Yup.ref('new_password')], 'Password must match')
    .required('Required')
})

export const vendorStoreInfoValidationSchema = Yup.object().shape({
  name: Yup.string().required(),
  description: Yup.string().required('Required'),
  whatsapp_number: Yup.string().required('Required'),
  contact_number: Yup.string().required('Required')
  // address1: Yup.string().required('Required')
  // address2: Yup.string().required('Required')
  // state: Yup.string().required('Required')
  // city: Yup.string().required('Required')
  // postal_code: Yup.string().required('Required')
})
