import * as Yup from 'yup'

export const BulkuploadSchema = Yup.object().shape({
  category: Yup.string().required('required')
})
