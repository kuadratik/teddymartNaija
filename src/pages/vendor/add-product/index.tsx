import BaseLayout from '@/components/Layout/BaseLayout'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import ImageSectionComponent from '@/components/Vendor/AddProducts/ImageSectionComponent'
import MoreDetails from '@/components/Vendor/AddProducts/MoreDetails'
import ProductInfo from '@/components/Vendor/AddProducts/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'
import VendorTabs from '@/components/Vendor/VendorTabs'
import {setType} from '@/redux/apiSlice/vendorSlice'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {productCategories} from '@/utils/constants'
import {addProductValidationSchema} from '@/utils/schemas'
import {Icon} from '@iconify/react'
import {Form} from 'antd'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import {useSelector} from 'react-redux'

const AddProducts = () => {
  const router = useRouter()
  const {type} = useSelector((state: any) => state.vendor)
  const dispatch = useDispatch()
  const [isActive, setIsActive] = useState(1)

  useEffect(() => {
    dispatch(setType({type: 'product'}))
  }, [])

  const {data, isLoading} = useGetAllCategoriesQuery({
    type: 'product'
  })

  const tabs = [
    {id: 1, title: 'Product Info'},
    {id: 2, title: 'More Details'},
    {id: 3, title: 'Image'}
  ]

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: {
        name: '',
        description: '',
        category: 0,
        price: '',
        additional_information: ''
      },
      validationSchema: addProductValidationSchema,
      validateOnChange: false,
      validateOnBlur: true,
      enableReinitialize: true,
      onSubmit: val => {
        if (isLastStep()) {
        } else {
          setIsActive(prev => prev + 1)
        }
      }
    }
  )

  const isLastStep = () => {
    return isActive === tabs.length
  }

  return (
    <VendorLayout>
      <BaseLayout>
        <div className="flex w-full flex-col gap-6">
          <TopBar title="Add Product" />

          <div className="mt-[60px] flex w-full flex-col gap-[31px]">
            {/* Tab Navigation */}
            <VendorTabs navItems={tabs} active={isActive} />

            {/* Tab Content */}
            <Form className="flex w-full flex-col gap-6" onFinish={handleSubmit} layout="vertical">
              {isActive === 1 && (
                <ProductInfo
                  setActive={setIsActive}
                  active={isActive}
                  {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
                  Categories={data?.data || []}
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

              {/* <button
                // onClick={() => {
                //   setActive(prev => prev + 1)
                // }}
                type="submit"
                className="mt-4 w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
              >
                Next
              </button> */}
            </Form>
          </div>
        </div>
      </BaseLayout>
    </VendorLayout>
  )
}

export default AddProducts
