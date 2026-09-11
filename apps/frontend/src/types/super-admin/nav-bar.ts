
export interface Subnav {
  name: string
  link: string
  active: boolean
  coming_soon: boolean
  icon: string
}
export interface ICreateNavBarRequest {
  type: 'bottom' | 'top'
  name: string
  link: string
  active: boolean
  coming_soon: boolean
  icon: string
  ordering: string
  subnav: Subnav[] | null
}

export interface INavBarListResponse {
  success: boolean
  message: string
  data: INavBarListDatum[]
}

export interface INavBarListDatum {
  id: number
  type: 'bottom' | 'top'
  name: string
  link: string
  active: boolean
  coming_soon: boolean
  icon: string
  subnav: INavBarListSubnav[]
  ordering: string
  created_at: string
  updated_at: string
}

export interface INavBarListSubnav {
  icon: string
  link: string
  name: string
  coming_soon: boolean
  active: boolean
}
