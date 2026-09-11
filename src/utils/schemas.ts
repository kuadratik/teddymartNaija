import * as Yup from 'yup'

export const addProductValidationSchema = Yup.object().shape({
  name: Yup.string().required(`This field is Required`),
  description: Yup.string().required(`This field is Required`),
  category: Yup.number().required(`This field is Required`).min(1, 'This field is Required'),
  price: Yup.string().required(`This field is Required`),
  additional_information: Yup.string(),
  image: Yup.mixed().required(`This field is Required`)
})

export const addServiceValidationSchema = Yup.object().shape({
  name: Yup.string().required(`This field is Required`),
  description: Yup.string().required(`This field is Required`),
  category: Yup.number().required(`This field is Required`).min(1, 'This field is Required'),
  additional_information: Yup.string(),
  image: Yup.mixed().required(`This field is Required`)
})

export const postAdValidationSchema = Yup.object().shape({
  type: Yup.string().required(`This field is Required`),
  title: Yup.string().required(`This field is Required`),
  category: Yup.number().required(`This field is Required`).min(1, 'This field is Required'),
  quantity: Yup.string(),
  price: Yup.string(),
  images: Yup.mixed().required(`This field is Required`)
})
