import BaseLayout from '@/components/Layout/BaseLayout'
import VendorNewLayout from '@/components/Layout/VendorNewLayout'
import SEOHead from '@/components/SharedUI/SEOHead'
import ImageSectionComponent from '@/components/Vendor/AddProducts/ImageSectionComponent'
import MoreDetails from '@/components/Vendor/AddProducts/MoreDetails'
import ProductInfo from '@/components/Vendor/AddProducts/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'
import VendorTabs from '@/components/Vendor/VendorTabs'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {addServiceValidationSchema} from '@/utils/schemas'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

const AddService = () => {
  const {type} = useSelector((state: any) => state.vendor)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setType({type: 'service'}))
  }, [])

  const [isActive, setIsActive] = useState(1)

  const {data, isLoading} = useGetAllCategoriesQuery({
    type: 'service'
  })

  const tabs = [
    {id: 1, title: 'Service Info'},
    {id: 2, title: 'More Details'},
    {id: 3, title: 'Image'}
  ]

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        name: '',
        description: '',
        category: 0,
        additional_information: ''
      },
      validationSchema: addServiceValidationSchema,
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: val => {
        // console.log(val)
      }
    }
  )

  return (
    <>
      <SEOHead
        title={`AfricanDiasporaMart | Add ${type}`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <VendorLayout>
        <BaseLayout>
          <div className="flex w-full flex-col gap-6">
            <div className="hidden lg:block">
              <TopBar title="Add Service" />
            </div>

            <div className="flex w-full flex-col gap-[31px]">
              {/* Tab Navigation */}
              <VendorTabs navItems={tabs} active={isActive} />

              {/* Tab Content */}
              <div className="flex w-full flex-col gap-6">
                {isActive === 1 && (
                  <ProductInfo
                    setActive={setIsActive}
                    active={isActive}
                    {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
                    Categories={data?.data}
                  />
                )}

                {isActive === 2 && (
                  <MoreDetails
                    active={isActive}
                    setActive={setIsActive}
                    {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
                  />
                )}

                {isActive === 3 && (
                  <ImageSectionComponent
                    active={isActive}
                    setActive={setIsActive}
                    {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
                  />
                )}
              </div>
            </div>
          </div>
        </BaseLayout>
      </VendorLayout>
    </>
  )
}

AddService.getLayout = function getLayout(page: React.ReactElement) {
  return <VendorNewLayout>{page}</VendorNewLayout>
}

export default AddService
