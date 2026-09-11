import DashboardHeader from '@/components/Vendor/components/DashboardHeader'
import BaseLayout from '@/components/Layout/BaseLayout'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SkeletonLoaderForPage from '@/components/SharedUI/Loader/SkeletonLoaderForPage'
import SEOHead from '@/components/SharedUI/SEOHead'
import BulkUploadForm from '@/components/Vendor/AddProducts/BulkUploadForm'
import ImageSectionComponent from '@/components/Vendor/AddProducts/ImageSectionComponent'
import MoreDetails from '@/components/Vendor/AddProducts/MoreDetails'
import ProductInfo from '@/components/Vendor/AddProducts/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'
import VendorTabs from '@/components/Vendor/VendorTabs'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useGetUserStoreListingItemQuery} from '@/services/vendor/vendor'
import {capitalizeFirstLetter} from '@/utils/fx'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'



const Edit = () => {
  const router = useRouter()
  const {id} = router.query
  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  const {type, selectedProduct} = useSelector((state: any) => state.vendor)
  const {data: storeData, isLoading: storeDataLoading} = useGetUserStoreListingItemQuery({
    userStore: isActiveUser?.slug!,
    listing: id as string
  })

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

  const {
    attributes, // Default empty object for attributes
    category_id = null,

    ...remainingValues
  } = storeData?.data || {}

  // console.log('storeData', storeData)

  // check the remainValues object to see if any key has a value that is null and set it as an empty string
  for (const key in remainingValues) {
    if (remainingValues[key] === null) {
      remainingValues[key] = ''
    }
  }

  const editData = {
    ...remainingValues,
    variants: remainingValues.variants
      ? remainingValues.variants.map((variant: any, index: number) => {
          const {measurement, ...newVariant} = variant

          return {
            ...newVariant,
            measurement: measurement ? JSON.parse(measurement) : [],
            variantId: index
          }
        })
      : [],
    category: category_id,
    measurement: attributes?.measurement ? JSON.parse(attributes.measurement) : [],
    product_model: attributes?.product_model ? attributes.product_model : '',
    material: attributes?.material,
    brand: attributes?.brand ? attributes.brand : '',
    color: attributes?.color ? attributes.color : '',
    size: attributes?.size ? JSON.parse(attributes?.size) : [],
    tags: attributes?.tags ? JSON.parse(attributes.tags) : [],
    size_chart_html: attributes?.size_chart_html ? JSON.parse(attributes?.size_chart_html) : '',
    size_chart_image: attributes?.size_chart_image ? attributes.size_chart_image : ''
  }

  if (storeDataLoading) {
    return <SkeletonLoaderForPage length={2} />
  }

  return (
    <div>
      <DashboardHeader
        btnText="Back"
        titleHeader="Edit Product"
        showInput={false}
        onClick={() => {
          router.back()
        }}
      />

      <div className="mt-[47px]">
        <BulkUploadForm
          addProduct={addProduct}
          setActive={setActive}
          active={active}
          sidebarArr={sidebarArr}
          editMode={true}
          editData={editData}
          editProduct={editProduct}
        />
      </div>
    </div>
  )
}

Edit.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default Edit
