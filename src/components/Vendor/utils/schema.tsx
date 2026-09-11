import * as Yup from 'yup'

export const BulkUploadSchema = Yup.object().shape({
  category: Yup.string().required('required')
})
