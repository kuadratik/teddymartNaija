export interface VendorLoginType {
  email: string
  password: string
}

export interface ForgetPasswordType {
  email: string
}

export interface ResetPasswordType extends ForgetPasswordType {
  new_password_confirmation: string
  new_password: string
  otp: string
}
