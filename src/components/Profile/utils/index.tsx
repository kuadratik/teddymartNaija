export interface VendorPersonalType {
  first_name: string
  last_name: string
  email: string
}

export interface VendorPasswordType {
  old_password: string
  new_password: string
  new_password_confirmation: string
}

export interface VendorStoreInformationType {
  name: string
  description: string
  contact_number: string
  whatsapp_number: string
  address1: string
  address2: string
  state: string | undefined
  postal_code: string
  city: string
  slug?: string
  profile_picture_path?: string | File
  banner_path?: string | File
}
