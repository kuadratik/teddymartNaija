import {FormikValues} from 'formik'

export const VendorType = [
  {
    value: 'products',
    title: 'I sell items',
    desc: 'Add your products, customers are waiting.',
    icon: 'solar:shop-bold-duotone'
  },
  {
    value: 'services',
    title: 'I offer services',
    desc: 'Advertise your services, clients are waiting.',
    icon: 'carbon:user-service'
  }
]

export interface VendorOnboardingProps {
  title_header?: boolean
  showProfile?: boolean
  values: FormikValues
  data?: any
  setFieldValue: any
  touched?: any
  errors: any
  handleChange: {
    (e: React.ChangeEvent<any>): void
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void
  }
}

export interface SignUpType {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  refferalType: null | string
  refferalCode: null | string
}

export interface OnboardingType {
  offers_product: boolean
  offers_service: boolean
  name: string
  description: string
  contact_number: string
  country_id?: string | undefined
  country?: string | undefined
  type?: string
  whatsapp_number: string
  address1: string
  address2: string
  state: string | undefined
  city: string
  postal_code: string
  banner_path?: any
  profile_picture_path: any
}

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@')

  if (localPart.length <= 2) {
    return email // If the local part is too short, return the original email
  }

  const maskedLocalPart = '*****' + localPart.slice(-1) // Mask the local part and show the last 2 characters
  return `${maskedLocalPart}@${domain}`
}
