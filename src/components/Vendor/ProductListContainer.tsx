import React from 'react'
import ProductListItem from './ProductListItem'
import EmptyData from '../SharedUI/EmptyData'
import {useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import {CurrencyType} from '@/types/store'

export interface IProductListType {
  id: number
  name: string
  images: string[]
  price?: number
  is_available: boolean
  slug: string
  currency?: CurrencyType
}

interface IProductListContainerProp {
  products: IProductListType[]
  available?: boolean
}

const ProductListContainer = ({products, available = true}: IProductListContainerProp) => {
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()
  return (
    <div className="flex w-full flex-col gap-[10px]">
      {products.length > 0 ? (
        products.map(product => <ProductListItem key={product.id} product={product} />)
      ) : (
        <EmptyData
          title="Your inventory is empty"
          btnTitle={available === true ? `Add a ${type}` : null}
          btnAction={() => {
            router.push(`/vendor/add-${type}`)
          }}
        />
      )}
    </div>
  )
}

export default ProductListContainer
