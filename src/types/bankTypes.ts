export interface IBankResponse {
  success: boolean
  message: string
  data: IBankData
}

export interface IBankData {
  banks: Bank[]
  meta: IBankMeta
}

export interface Bank {
  id: number
  name: string
  slug: string
  code: string
  longcode: string
  gateway: null | string
  pay_with_bank: boolean
  supports_transfer: boolean
  active: boolean
  country: string
  currency: string
  type: string
  is_deleted: boolean
  createdAt: string
  updatedAt: string
}

export interface IBankMeta {
  next: string
  previous: string
  perPage: number
}
