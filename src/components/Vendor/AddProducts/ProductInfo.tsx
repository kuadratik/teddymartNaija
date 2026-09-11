import {Categories, CategoriesProps} from '@/components/Auth/Products/utils'
import CustomButton from '@/components/SharedUI/Buttons/Button'
import DrawerContainer from '@/components/SharedUI/DrawerContainer'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import {useMediaQuery} from '@/hooks/use-media-query'
import {CategoryListType} from '@/types/types'
import {capitalizeFirstLetter} from '@/utils/fx'
import {Radio, RadioChangeEvent} from 'antd'
import {error} from 'console'
import {FormikErrors, FormikTouched} from 'formik'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import TitleText from '../TitleText'

export interface IProductInfoProps {
  active: number
  setActive: React.Dispatch<React.SetStateAction<number>>
  handleChange: any
  Categories?: CategoryListType[]
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void> | Promise<FormikErrors<any>>
  values: any
  editMode?: boolean
  setFieldError: (field: string, value: string | undefined) => void
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
}

const ProductInfo = ({
  active,
  setActive,
  handleChange,
  Categories,
  values,
  setFieldValue,
  setFieldError,
  errors,
  touched
}: IProductInfoProps) => {
  const {type} = useSelector((state: any) => state.vendor)

  const [showCategory, setShowCategory] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const onChange = (e: RadioChangeEvent) => {
    setSelectedCategory(e.target.value)
    setFieldValue('category', e.target.value)
    setShowCategory(false)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* {type === 'product' ? (
        <TextInput
          placeholder="Product Name*"
          onChange={handleChange}
          errorMessage={touched && touched.product_name && errors && errors.product_name ? errors.product_name : ''}
          name={'product_name'}
          type={'text'}
          value={values.product_name}
        />
      ) : ( */}
      <TextInput
        placeholder={`${capitalizeFirstLetter(type)} Name*`}
        onChange={e => {
          if (e.target.value.length <= 20) {
            handleChange(e)
          }
        }}
        name={'name'}
        type={'text'}
        value={values.name}
        errorMessage={errors && errors.name ? errors.name : ''}
      />
      {/* )} */}
      {type === 'product' && (
        <TextInput
          iconName={'healthicons:dollar'}
          iconColor="text-[#6B7280]"
          placeholder="Price*"
          onChange={handleChange}
          type={'number'}
          name={'price'}
          value={values.price}
          errorMessage={errors && errors.price ? errors.price : ''}
        />
      )}
      <div
        className="cursor-pointer"
        onClick={() => {
          setShowCategory(true)
        }}
      >
        <TextInput
          placeholder="Select Category*"
          iconName="mdi:chevron-down"
          iconColor="text-[#6B7280]"
          onChange={handleChange}
          name={'category'}
          type={'text'}
          value={Categories?.find(cat => cat.id === values.category)?.name || ''}
          readOnly
          errorMessage={errors && errors.category ? errors.category : ''}
        />
      </div>

      <CustomButton
        onClick={() => {
          if (values['name'].length === 0) {
            setFieldError('name', `${capitalizeFirstLetter(type)} Name is required`)
          }

          if (values['category'] === 0) {
            setFieldError('category', `Category is required`)
          }
          if (type === 'product') {
            if (values['price'].length === 0) setFieldError('price', `Price is required`)
          }

          if (values['name'].length > 0 && values['category'] !== 0) {
            setActive(prev => prev + 1)
          }
        }}
        type="button"
        className="mt-4 w-full rounded-[10px] bg-[#000000] px-1 py-4 text-[14px] text-white"
      >
        Next
      </CustomButton>

      {isDesktop && showCategory && (
        <PlannerModal
          modalOpen={showCategory}
          onCloseModal={() => {
            setShowCategory(false)
          }}
          setModalOpen={setShowCategory}
          maskCloseable={true}
        >
          <TitleText title={`${capitalizeFirstLetter(type)} Category`} />
          <Radio.Group value={values.category} onChange={onChange} className="flex flex-col gap-[22px]">
            {Categories?.map((category, index) => (
              <Radio key={index} value={category.id}>
                {category.name}
              </Radio>
            ))}
          </Radio.Group>
        </PlannerModal>
      )}

      {!isDesktop && showCategory && (
        <DrawerContainer
          open={showCategory}
          onClose={() => setShowCategory(false)}
          title={`${capitalizeFirstLetter(type)} Category`}
        >
          <Radio.Group value={values.category} onChange={onChange} className="flex flex-col gap-[22px]">
            {Categories?.map((category, index) => (
              <Radio key={index} value={category.id}>
                {category.name}
              </Radio>
            ))}
          </Radio.Group>
        </DrawerContainer>
      )}
    </div>
  )
}

export default ProductInfo
