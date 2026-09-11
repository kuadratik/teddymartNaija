import DashboardHeader from '@/components/DashboardHeader'
import BaseLayout from '@/components/Layout/BaseLayout'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import BulkUpload from '@/components/Vendor/AddProducts/BulkUpload'
import ImageSectionComponent from '@/components/Vendor/AddProducts/ImageSectionComponent'
import MoreDetails from '@/components/Vendor/AddProducts/MoreDetails'
import ProductInfo from '@/components/Vendor/AddProducts/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'
import VendorTabs from '@/components/Vendor/VendorTabs'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {addProductValidationSchema} from '@/utils/schemas'
import {Form} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

// const AddProducts = () => {
//   const router = useRouter()
//   const {type} = useSelector((state: any) => state.vendor)
//   const dispatch = useDispatch()
//   const [isActive, setIsActive] = useState(1)

//   useEffect(() => {
//     dispatch(setType({type: 'product'}))
//   }, [])

//   const {data, isLoading} = useGetAllCategoriesQuery({
//     type: 'product'
//   })

//   const tabs = [
//     {id: 1, title: 'Product Info'},
//     {id: 2, title: 'More Details'},
//     {id: 3, title: 'Image'}
//   ]

//   const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
//     {
//       initialValues: {
//         name: '',
//         description: '',
//         category: 0,
//         price: '',
//         additional_information: ''
//       },
//       validationSchema: addProductValidationSchema,
//       validateOnChange: false,
//       validateOnBlur: true,
//       enableReinitialize: true,
//       onSubmit: val => {
//         if (isLastStep()) {
//         } else {
//           setIsActive(prev => prev + 1)
//         }
//       }
//     }
//   )

//   const isLastStep = () => {
//     return isActive === tabs.length
//   }

//   return (
//     <>
//       <SEOHead
//         title={`AfricanDiasporaMart | Add ${type === 'product' ? 'Product' : 'Service'}`}
//         description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
//       />
//       <VendorLayout>
//         <BaseLayout>
//           <div className="flex w-full flex-col gap-6">
//             <div className="hidden lg:block">
//               <TopBar title="Add Product" />
//             </div>
//             <div className="flex w-full flex-col gap-[31px]">
//               {/* Tab Navigation */}
//               <VendorTabs navItems={tabs} active={isActive} />

//               {/* Tab Content */}
//               <Form className="flex w-full flex-col gap-6" onFinish={handleSubmit} layout="vertical">
//                 {isActive === 1 && (
//                   <ProductInfo
//                     setActive={setIsActive}
//                     active={isActive}
//                     {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
//                     Categories={data?.data || []}
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
//                     {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
//                   />
//                 )}

//                 {/* <button
//                 // onClick={() => {
//                 //   setActive(prev => prev + 1)
//                 // }}
//                 type="submit"
//                 className="mt-4 w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
//               >
//                 Next
//               </button> */}
//               </Form>
//             </div>
//           </div>
//         </BaseLayout>
//       </VendorLayout>
//     </>
//   )
// }

const AddProducts = () => {
  return (
    <div>
      <DashboardHeader btnText="Back" titleHeader="Add Product" showInput={false} />
      <BulkUpload />
    </div>
  )
}
AddProducts.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default AddProducts
