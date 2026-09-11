import * as Yup from 'yup'

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Email is Invalid').required('Required'),
  password: Yup.string()
    .required('Required')
    .min(8, 'Password must be at least 8 characters')
    .max(15, 'Password must be at most 15 characters')
  // .matches(
  //   /^(?=.*[a-z])(?=.*[@$!%*#-?&])[A-Za-z\d@$!%*#?&\.]/,
  //   'Must Contain one Lowercase, and one special case Character'
  // )
})
