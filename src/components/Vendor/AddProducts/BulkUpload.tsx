import React, {useEffect, useState} from 'react'
import BulkUploadForm from './BulkUploadForm'
import SingleProduct from './SingleProduct'
import useUpdatedEffect from '@/hooks/useUpdatedEffect'

const BulkUpload = () => {
  const [sidebarArr, setSideBarArr] = useState<any>([])
  const [active, setActive] = useState()

  const addProduct = (val: {}) => {
    setSideBarArr([...sidebarArr, val])
  }

  const editProduct = (val: {}, id: number) => {
    // find the product with the id and replace it with the new product
    const newProducts = sidebarArr.map((product: any, index: number) => {
      if (index === id) {
        return val
      }
      return product
    })

    setSideBarArr(newProducts)
  }

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
        <div className="mt-[47px] flex flex-col-reverse gap-6 md:flex-row">
          <div className="flex-[4]">
            <BulkUploadForm
              setActive={setActive}
              active={active}
              sidebarArr={sidebarArr}
              addProduct={addProduct}
              editProduct={editProduct}
            />
          </div>

          <div className="flex-shrink-0 md:w-[300px]">
            <div className="flex flex-col gap-3">
              {' '}
              {sidebarArr?.map((value: any, id: any) => {
                return (
                  <div className="" id={id}>
                    <SingleProduct value={value} active={active} id={id} setActive={setActive} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-[47px]">
          <BulkUploadForm
            addProduct={addProduct}
            setActive={setActive}
            active={active}
            sidebarArr={sidebarArr}
            editProduct={editProduct}
          />
        </div>
      )}
    </div>
  )
}

export default BulkUpload
