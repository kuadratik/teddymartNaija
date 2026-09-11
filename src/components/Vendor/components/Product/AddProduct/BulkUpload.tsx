import React, {useEffect, useState} from 'react'
import BulkUploadForm from './BulkUploadForm'
import {StyledContentWrapper} from '../../Order/OrderLogisticsView'
import SingleProduct from './SingleProduct'
import useUpdatedEffect from '@/hooks/useUpdatedEffect'

const BulkUpload = () => {
  const [sidebarArr, setSideBarArr] = useState<any>([])
  const [active, setActive] = useState()

  const addProduct = (val: {}) => {
    setSideBarArr([...sidebarArr, val])
  }

  console.log(sidebarArr)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const product_arr = JSON.parse(localStorage.getItem('product_arr')!)
      setSideBarArr(product_arr ?? [])
    }
  }, [])

  useUpdatedEffect(() => {
    localStorage.setItem('product_arr', JSON.stringify(sidebarArr))
  }, [sidebarArr])

  return (
    <div>
      {sidebarArr?.length ? (
        <div className="mt-[47px] gap-6 md:flex">
          <div className="flex-[4]">
            <BulkUploadForm setActive={setActive} active={active} sidebarArr={sidebarArr} addProduct={addProduct} />
          </div>

          <div className="flex-shrink-0 md:w-[300px]">
            <div className="flex flex-col gap-3">
              {' '}
              {sidebarArr?.map((_val: string, id: any) => {
                return (
                  <div className="" id={id}>
                    <SingleProduct active={active} id={id} setActive={setActive} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-[47px]">
          <BulkUploadForm addProduct={addProduct} setActive={setActive} active={active} sidebarArr={sidebarArr} />
        </div>
      )}
    </div>
  )
}

export default BulkUpload
