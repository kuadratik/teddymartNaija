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

// const Edit = () => {
//   const router = useRouter()
//   const {id} = router.query
//   const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
//   const {type, selectedProduct} = useSelector((state: any) => state.vendor)
//   const {data: storeData, isLoading: storeDataLoading} = useGetUserStoreListingItemQuery({
//     userStore: isActiveUser?.slug!,
//     listing: id as string
//   })

//   console.log('storeData', storeData)
//   const {data, isLoading} = useGetAllCategoriesQuery({
//     type: selectedProduct?.type || storeData?.data?.type || type
//   })

//   const [isActive, setIsActive] = useState(1)

//   const tabs = [
//     {id: 1, title: `${capitalizeFirstLetter(type)} Info`},
//     {id: 2, title: 'More Details'},
//     {id: 3, title: 'Image'}
//   ]

//   const [initialValues, setInitialValues] = useState({
//     name: '',
//     description: '',
//     category: 0,
//     price: '',
//     additional_information: '',
//     images: []
//   })

//   useEffect(() => {
//     if (selectedProduct || storeData) {
//       setInitialValues({
//         name: selectedProduct?.name || storeData?.data?.name,
//         description: selectedProduct?.description || storeData?.data?.description,
//         category: selectedProduct?.category_id || storeData?.data?.category_id,
//         price: selectedProduct?.price || storeData?.data?.price,
//         additional_information: selectedProduct?.additional_information || storeData?.data?.additional_information,
//         images: selectedProduct?.images || storeData?.data?.images
//       })
//     }
//   }, [storeData])

//   const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
//     {
//       initialValues: initialValues,
//       // validationSchema: Schema[currentForm],
//       validateOnChange: false,
//       validateOnBlur: false,
//       enableReinitialize: true,
//       onSubmit: val => {
//         // console.log(val)
//       }
//     }
//   )

//   return (
//     <>
//       <SEOHead
//         title={`myEKI | Edit ${capitalizeFirstLetter(type)}`}
//         description="myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!"
//       />
//       <VendorLayout>
//         <BaseLayout>
//           <div className="flex w-full flex-col gap-6">
//             <TopBar title={`Edit ${capitalizeFirstLetter(type)}`} />

//             <div className="mt-[60px] flex w-full flex-col gap-[31px]">
//               {/* Tab Navigation */}
//               <VendorTabs navItems={tabs} active={isActive} />

//               {/* Tab Content */}
//               <div className="flex w-full flex-col gap-6">
//                 {isActive === 1 && (
//                   <ProductInfo
//                     setActive={setIsActive}
//                     active={isActive}
//                     {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
//                     Categories={data?.data}
//                   />
//                 )}

//                 {isActive === 2 && (
//                   <MoreDetails
//                     active={isActive}
//                     setActive={setIsActive}
//                     {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
//                   />
//                 )}

//                 {isActive === 3 && (
//                   <ImageSectionComponent
//                     active={isActive}
//                     setActive={setIsActive}
//                     editMode={true}
//                     {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </BaseLayout>
//       </VendorLayout>
//     </>
//   )
// }

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
    attributes: {
      measurement = null,
      product_model = null,
      material = null,
      brand = null,
      color = null,
      size = null,
      tags = null,
      size_chart_html = null,
      size_chart_image = null
    } = {}, // Default empty object for attributes
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
            measurement: JSON.parse(measurement),
            variantId: index
          }
        })
      : [],
    category: category_id,
    measurement: JSON.parse(measurement),
    product_model,
    material,
    brand,
    color,
    size: JSON.parse(size),
    tags: JSON.parse(tags),
    size_chart_html: JSON.parse(size_chart_html),
    size_chart_image
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
