import BaseLayout from '@/components/Layout/BaseLayout'
import ImageSectionComponent from '@/components/Vendor/AddProducts/ImageSectionComponent'
import MoreDetails from '@/components/Vendor/AddProducts/MoreDetails'
import ProductInfo from '@/components/Vendor/AddProducts/ProductInfo'
import TopBar from '@/components/Vendor/TopBar'
import VendorLayout from '@/components/Vendor/VendorLayout'
import VendorTabs from '@/components/Vendor/VendorTabs'
import {useAppSelector} from '@/hooks/reduxHooks'
import {useGetAllCategoriesQuery} from '@/services/category/category'
import {useGetUserStoreListingItemQuery} from '@/services/vendor/vendor'
import {productCategories} from '@/utils/constants'
import {capitalizeFirstLetter} from '@/utils/fx'
import {useFormik} from 'formik'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

const Edit = () => {
  const router = useRouter()
  const {id} = router.query
  const isAuthenticatedUser = useAppSelector(state => state.auth.user) // get authenticated user
  const {type, selectedProduct} = useSelector((state: any) => state.vendor)
  const {data: storeData, isLoading: storeDataLoading} = useGetUserStoreListingItemQuery({
    userStore: isAuthenticatedUser?.store?.slug!,
    listing: id as string
  })

  console.log('storeData', storeData)
  const {data, isLoading} = useGetAllCategoriesQuery({
    type: selectedProduct?.type || storeData?.data?.type || type
  })

  const [isActive, setIsActive] = useState(1)

  const tabs = [
    {id: 1, title: `${capitalizeFirstLetter(type)} Info`},
    {id: 2, title: 'More Details'},
    {id: 3, title: 'Image'}
  ]

  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    category: 0,
    price: '',
    additional_information: '',
    images: []
  })

  useEffect(() => {
    if (selectedProduct || storeData) {
      setInitialValues({
        name: selectedProduct?.name || storeData?.data?.name,
        description: selectedProduct?.description || storeData?.data?.description,
        category: selectedProduct?.category_id || storeData?.data?.category_id,
        price: selectedProduct?.price || storeData?.data?.price,
        additional_information: selectedProduct?.additional_information || storeData?.data?.additional_information,
        images: selectedProduct?.images || storeData?.data?.images
      })
    }
  }, [storeData])

  const {errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError} = useFormik<any>(
    {
      initialValues: initialValues,
      // validationSchema: Schema[currentForm],
      validateOnChange: false,
      validateOnBlur: false,
      enableReinitialize: true,
      onSubmit: val => {
        console.log(val)
      }
    }
  )

  return (
    <VendorLayout>
      <BaseLayout>
        <div className="flex w-full flex-col gap-6">
          <TopBar title={`Edit ${capitalizeFirstLetter(type)}`} />

          <div className="mt-[60px] flex w-full flex-col gap-[31px]">
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
                  editMode={true}
                  {...{errors, values, handleSubmit, setFieldValue, handleChange, resetForm, touched, setFieldError}}
                />
              )}
            </div>
          </div>
        </div>
      </BaseLayout>
    </VendorLayout>
  )
}

export default Edit
