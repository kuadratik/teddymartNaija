export interface GetShippingConfigTopLevel {
  success: boolean
  message: string
  data: GetShippingConfigData
}

export interface GetShippingConfigData {
  storeMethodTypes: string[]
  storeMethods: GetShippingConfigStoreMethods
}

export interface GetShippingConfigStoreMethods {
  'store pick-up': GetShippingConfigStorePickUp[]
  'vendor-fulfilled shipping': GetShippingConfigStorePickUp[]
}

export interface GetShippingConfigStorePickUp {
  id: number
  store_id: number
  method_type: string
  pick_up_time: null | string
  location: string
  amount: null | string
  created_at: string
  updated_at: string
}
