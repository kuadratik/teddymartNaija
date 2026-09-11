export interface IStaffManagementResponse {
  success: boolean
  message: string
  data: IStaffManagementData
}

export interface IStaffManagementData {
  current_page: number
  data: IStaffManagementDatum[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: IStaffManagementLink[]
  next_page_url: null
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface IStaffManagementDatum {
  id: number
  first_name: string
  last_name: string
  email: string
  role: null | string
  created_at: string
  updated_at: string
  permissions: null | string[]
  active: boolean
}

export interface IStaffManagementLink {
  url: null | string
  label: string
  active: boolean
}
// single admin staff response types
export interface IStaffManagementDetailResponse {
  success: boolean
  message: string
  data: IStaffManagementDatum
}

export interface ICreateAdminStaffRequest {
  first_name: string
  last_name: string
  email: string
  role: string
  password: string
  permissions: string[]
}

// permissions response types
export interface UserPermissionsResponse {
  success: boolean
  message: string
  data: UserPermissionsDatum[]
}

export interface UserPermissionsDatum {
  id: number
  name: string
  key: string
  created_at: string
  updated_at: string
}

// super admin profile types
export interface SuperAdminProfileResponse {
  success: boolean
  message: string
  data: SuperAdminProfileData
}

export interface SuperAdminProfileData {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  created_at: string
  updated_at: string
  permissions: null
  active: boolean
  deleted_at: null
}