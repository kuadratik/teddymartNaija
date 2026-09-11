import * as Yup from 'yup'

export const ClipOrderSchema = Yup.object().shape({
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('required'),
  email: Yup.string().email('Email is Invalid').required('Required'),
  phone: Yup.number().required('Required')
})
