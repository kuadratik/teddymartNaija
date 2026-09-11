import {useFormik} from 'formik'
import React, {useEffect, useState} from 'react'
import {BulkUploadProductType} from '../utils'
import {StoreInformationSchema} from '@/components/Auth/Signup/utils/schema'
import {BulkuploadSchema} from '../utils/schema'
import {Button, Collapse, Descriptions, Form, Input, Select, Switch, Tag} from 'antd'
import styled from '@emotion/styled'
import tw from 'tailwind-styled-components'
import TextInput from '@/components/SharedUI/Input/TextInput'
import FormItem from 'antd/es/form/FormItem'
import {useAppSelector} from '@/hooks/reduxHooks'
import {getIcon} from '@/components/Vendor/utils'
import {Icon} from '@iconify/react'
import {StyledContentWrapper} from '../../Order/OrderLogisticsView'
import ProductIImageFile from './ProductImage'
import {CloseOutlined} from '@ant-design/icons'

const {Panel} = Collapse

const {TextArea} = Input

const {Option} = Select

interface BulkUploadProps {
  active: any
  sidebarArr: any[]
  setActive: React.Dispatch<React.SetStateAction<any>>
  addProduct: (val: {}) => void
}

export const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
  event.preventDefault()
  event.stopPropagation()
}

const BulkUploadForm = ({active, sidebarArr, addProduct, setActive}: BulkUploadProps) => {
  const [firstFile, setFirstFile] = useState<string | null>(null)

  const initialValues = {
    category: '',
    product_name: '',
    quantity: '',
    product_price: '',
    discount: '',
    discounted_price: '',
    measurement: '',
    size: '',
    brand: '',
    product_model: '',
    material: '',
    color: '',
    description: '',
    additional_description: '',
    first_upload: '',
    variants: []
  }
  const {
    errors,
    values,
    handleSubmit,
    setFieldValue,
    handleChange,
    resetForm,
    touched
    // setFieldError,
  } = useFormik<BulkUploadProductType>({
    initialValues: active >= 0 && active !== null ? sidebarArr[active] : initialValues,
    validationSchema: BulkuploadSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: val => {
      addProduct(val)

      window.scrollTo({
        top: 0, // Scroll to the top
        behavior: 'smooth' // Smooth scrolling effect
      })
      resetForm()
    }
  })

  // Save form data to localStorage on any change
  // useEffect(() => {
  //   localStorage.setItem('create_product', JSON.stringify(values))
  // }, [values])

  const addVariant = () => {
    setFieldValue('variants', [
      ...values.variants,
      {weight: '', product_model: '', size: '', price: '', color: '', discount: ''}
    ])
  }

  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)

  const [tags, setTags] = useState(['Tag 1', 'Tag 2', 'Tag 3'])

  const handleInputConfirm = (): any => {
    if (values.tags && tags.indexOf(values.tags) === -1) {
      setTags([...tags, values.tags])
    }
    setFieldValue('tags', '')
  }

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag)
    setTags(newTags)
  }

  const isActiveUser = useAppSelector(state => state.auth.activeUser) // get authenticated user
  return (
    <div>
      <Form layout="vertical" onFinish={handleSubmit}>
        <div className="flex flex-col gap-6">
          {' '}
          <StyledContentWrapper className="">
            <Collapse
              defaultActiveKey={['1']}
              expandIconPosition="right"
              className="space-y-2 !border-none bg-transparent"
            >
              <Panel
                header={<p className="text-[20px] font-bold text-[#6B7280]">Product Information</p>}
                key="1"
                className=" "
              >
                <FormFieldWrapper>
                  <Form.Item
                    label={<FormFieldTitle>Category*</FormFieldTitle>}
                    className="!w-full"
                    help={touched.category && errors.category ? errors.category : ''}
                    validateStatus={touched.category && errors.category ? 'error' : undefined}
                  >
                    <Select
                      size="large"
                      className="!w-full"
                      placeholder="select"
                      value={values.category}
                      // loading={stateQueries.isLoading}
                      onChange={val => {
                        setFieldValue('category', val)
                      }}
                      options={[
                        {
                          label: 'Option 1',
                          value: 'option1'
                        },
                        {
                          label: 'Option 2',
                          value: 'option2'
                        },
                        {
                          label: 'Option 3',
                          value: 'option3'
                        }
                      ]}
                      showSearch
                      optionFilterProp="children"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      filterOption={(input, option: any) =>
                        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
                      }
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                    />
                  </Form.Item>

                  <Form.Item className="!w-full" label={<FormFieldTitle>Product Name*</FormFieldTitle>}>
                    <Input
                      size="large"
                      type="text"
                      name={'product_name'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.product_name}
                    />
                  </Form.Item>
                </FormFieldWrapper>
                <FormFieldWrapper>
                  <Form.Item
                    label={<FormFieldTitle>Quantity*</FormFieldTitle>}
                    className="!w-full"
                    help={touched.quantity && errors.quantity ? errors.quantity : ''}
                    validateStatus={touched.quantity && errors.quantity ? 'error' : undefined}
                  >
                    <Input
                      size="large"
                      type="text"
                      name={'quantiity'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.quantity}
                    />
                  </Form.Item>
                  <Form.Item className="!w-full" label={<FormFieldTitle>Product Price*</FormFieldTitle>}>
                    <Input
                      size="large"
                      prefix={<Icon icon={getIcon(isActiveUser?.country?.currency_code)} />}
                      type="text"
                      name={'product_price'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.product_price}
                    />
                  </Form.Item>
                  <Form.Item className="!w-full" label={<FormFieldTitle>Discount</FormFieldTitle>}>
                    <Input
                      addonBefore={'%'}
                      size="large"
                      type="text"
                      name={'discount'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.discount}
                    />
                  </Form.Item>
                </FormFieldWrapper>

                <FormFieldWrapper>
                  <Form.Item
                    label={<FormFieldTitle>Discounted Price</FormFieldTitle>}
                    className="!w-full"
                    help={touched.discounted_price && errors.discounted_price ? errors.discounted_price : ''}
                    validateStatus={touched.discounted_price && errors.discounted_price ? 'error' : undefined}
                  >
                    <Input
                      size="large"
                      type="text"
                      disabled
                      name={'discounted_price'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.discounted_price}
                    />
                  </Form.Item>
                  <Form.Item className="!w-full" label={<FormFieldTitle>Measurement</FormFieldTitle>}>
                    <Input
                      size="large"
                      type="text"
                      addonBefore={
                        <Select defaultValue="http://" className="!text-white">
                          <Option className="!bg-transparent hover:!bg-black hover:!text-white" value="http://">
                            Kg
                          </Option>
                          <Option className="!bg-transparent hover:!bg-black hover:!text-white" value="https://">
                            Ml
                          </Option>
                        </Select>
                      }
                      name={'measurement'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.measurement}
                    />
                  </Form.Item>
                  <Form.Item className="!w-full" label={<FormFieldTitle>Size</FormFieldTitle>}>
                    <Select
                      size="large"
                      className="!w-full"
                      placeholder="select"
                      value={values.size}
                      // loading={stateQueries.isLoading}
                      onChange={val => {
                        setFieldValue('size', val)
                      }}
                      options={[
                        {
                          label: 'large',
                          value: 'large'
                        },
                        {
                          label: 'medium',
                          value: 'medium'
                        }
                      ]}
                      showSearch
                      optionFilterProp="children"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      filterOption={(input, option: any) =>
                        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
                      }
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                    />
                  </Form.Item>
                </FormFieldWrapper>
                <FormFieldWrapper>
                  <Form.Item
                    label={<FormFieldTitle>Brand</FormFieldTitle>}
                    className="!w-full"
                    help={touched.brand && errors.brand ? errors.brand : ''}
                    validateStatus={touched.brand && errors.brand ? 'error' : undefined}
                  >
                    <Input
                      size="large"
                      type="text"
                      name={'brand'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.brand}
                    />
                  </Form.Item>
                  <Form.Item className="!w-full" label={<p className="font-semibold text-[#6B7280]">Product Model</p>}>
                    <Input
                      size="large"
                      type="text"
                      name={'product_model'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.product_model}
                    />
                  </Form.Item>
                  <Form.Item className="!w-full" label={<p className="font-semibold text-[#6B7280]">Material</p>}>
                    <Select
                      size="large"
                      className="!w-full"
                      placeholder="select"
                      value={values.material}
                      // loading={stateQueries.isLoading}
                      onChange={val => {
                        setFieldValue('material', val)
                      }}
                      options={[
                        {
                          label: 'large',
                          value: 'large'
                        },
                        {
                          label: 'medium',
                          value: 'medium'
                        }
                      ]}
                      showSearch
                      optionFilterProp="children"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      filterOption={(input, option: any) =>
                        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
                      }
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                    />
                  </Form.Item>
                </FormFieldWrapper>

                <FormFieldWrapper>
                  <Form.Item className="!w-[50%]" label={<FormFieldTitle>Color</FormFieldTitle>}>
                    <Select
                      size="large"
                      className="!w-full"
                      placeholder="select"
                      value={values.color}
                      // loading={stateQueries.isLoading}
                      onChange={val => {
                        setFieldValue('color', val)
                      }}
                      options={[
                        {
                          label: 'blue',
                          value: 'blue'
                        },
                        {
                          label: 'red',
                          value: 'red'
                        }
                      ]}
                      showSearch
                      optionFilterProp="children"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      filterOption={(input, option: any) =>
                        (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
                      }
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                    />
                  </Form.Item>
                </FormFieldWrapper>
                <FormFieldWrapper>
                  <Form.Item
                    className="!w-[50%]"
                    label={<FormFieldTitle>Full Description* {`${values.description?.length}/500`}</FormFieldTitle>}
                  >
                    <TextArea
                      value={values.description}
                      onChange={e => setFieldValue('description', e.target.value)}
                      maxLength={500}
                      rows={4}
                      placeholder=""
                    />{' '}
                  </Form.Item>
                  <Form.Item
                    className="!w-[50%]"
                    label={
                      <FormFieldTitle>
                        Addidtional Description* {`${values.additional_description?.length}/1000`}
                      </FormFieldTitle>
                    }
                  >
                    <TextArea
                      value={values.additional_description}
                      onChange={e => setFieldValue('additional_description', e.target.value)}
                      maxLength={1000}
                      rows={4}
                      placeholder=""
                    />{' '}
                  </Form.Item>
                </FormFieldWrapper>
                <FormFieldWrapper>
                  <Form.Item
                    label={<FormFieldTitle>Add Tags</FormFieldTitle>}
                    className="!w-full"
                    help={touched.tags && errors.tags ? errors.tags : ''}
                    validateStatus={touched.tags && errors.tags ? 'error' : undefined}
                  >
                    <Input
                      size="large"
                      type="text"
                      name={'tags'}
                      placeholder=""
                      onChange={handleChange}
                      value={values.tags}
                      onPressEnter={handleInputConfirm}
                      onBlur={handleInputConfirm}
                    />
                  </Form.Item>
                </FormFieldWrapper>
                <div className="mb-6 flex gap-2">
                  {' '}
                  {tags.map((value, index) => {
                    return (
                      <Tag
                        closable
                        closeIcon={<CloseOutlined style={{fontSize: '14px', color: '#0077B5'}} />}
                        onClose={e => {
                          e.preventDefault()
                          handleClose(value)
                        }}
                        style={{marginRight: 5, marginLeft: 5}}
                        className="flex items-center rounded-[7px] !border-none bg-[#EBF4F9] p-1 px-3 font-inter text-[#0077B5]"
                        onMouseDown={onPreventMouseDown}
                      >
                        <div className="p-1 text-sm font-semibold">{value}</div>
                      </Tag>
                    )
                  })}
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <FormFieldTitle>Add Shoe Size chart</FormFieldTitle>
                    <Switch defaultChecked={false} checked={false} size="small" />
                  </div>

                  <div className="flex items-center gap-2">
                    <FormFieldTitle>Add Shoe Size chart</FormFieldTitle>
                    <Switch defaultChecked size="small" />
                  </div>
                </div>
              </Panel>
            </Collapse>
          </StyledContentWrapper>
          <StyledContentWrapper>
            {' '}
            <Collapse
              defaultActiveKey={['1']}
              expandIconPosition="right"
              className="space-y-2 !border-none bg-transparent"
            >
              <Panel
                header={<p className="text-[20px] font-bold text-[#6B7280]">Image Gallery</p>}
                key="1"
                className=" "
              >
                <div
                  className={`mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-6 ${sidebarArr?.length ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}
                >
                  <ProductIImageFile
                    errorText={''}
                    id="image-upload"
                    accept=".png, .jpeg, .jpg, .webp"
                    title={<FormFieldTitle>Product Image 1</FormFieldTitle>}
                    placeholder={'PNG, JPG, JPEG, WEBP (max. 1080×1080px)'}
                    uploadedDetails={values.first_upload}
                    setUploadedDetails={e => {
                      setUploadedDetails(e)
                      setFieldValue('first_upload', e)
                    }}
                    uploadedFile={firstFile}
                    setUploadedFile={setFirstFile}
                    heightLimit={10800000000}
                    widthLimit={1080000000000}
                  />
                  <ProductIImageFile
                    errorText={''}
                    id="image-upload"
                    accept=".png, .jpeg, .jpg, .webp"
                    title={<FormFieldTitle>Product Image 2</FormFieldTitle>}
                    placeholder={'PNG, JPG, JPEG, WEBP (max. 1080×1080px)'}
                    uploadedDetails={values.first_upload}
                    setUploadedDetails={e => {
                      setUploadedDetails(e)
                      setFieldValue('first_upload', e)
                    }}
                    uploadedFile={firstFile}
                    setUploadedFile={setFirstFile}
                    heightLimit={10800000000}
                    widthLimit={1080000000000}
                  />
                  <ProductIImageFile
                    errorText={''}
                    id="image-upload"
                    accept=".png, .jpeg, .jpg, .webp"
                    title={<FormFieldTitle>Product Image 3</FormFieldTitle>}
                    placeholder={'PNG, JPG, JPEG, WEBP (max. 1080×1080px)'}
                    uploadedDetails={values.first_upload}
                    setUploadedDetails={e => {
                      setUploadedDetails(e)
                      setFieldValue('first_upload', e)
                    }}
                    uploadedFile={firstFile}
                    setUploadedFile={setFirstFile}
                    heightLimit={10800000000}
                    widthLimit={1080000000000}
                  />
                  <ProductIImageFile
                    errorText={''}
                    id="image-upload"
                    accept=".png, .jpeg, .jpg, .webp"
                    title={<FormFieldTitle>Product Image 4</FormFieldTitle>}
                    placeholder={'PNG, JPG, JPEG, WEBP (max. 1080×1080px)'}
                    uploadedDetails={values.first_upload}
                    setUploadedDetails={e => {
                      setUploadedDetails(e)
                      setFieldValue('first_upload', e)
                    }}
                    uploadedFile={firstFile}
                    setUploadedFile={setFirstFile}
                    heightLimit={10800000000}
                    widthLimit={1080000000000}
                  />
                </div>
              </Panel>
            </Collapse>
          </StyledContentWrapper>
          <Button
            onClick={addVariant}
            style={{
              backgroundColor: '#EBF4F9',
              color: '#0077B5',
              border: 'none',
              // Force the styles to remain the same on hover
              transition: 'none' // Disable any transitions
            }}
            htmlType="button"
            className="w-[140px] whitespace-nowrap rounded-lg bg-[#EBF4F9] px-4 py-[22px] text-[#0077B5]"
          >
            Add Variant
          </Button>
          {values?.variants?.length > 0 && (
            <StyledContentWrapper className="">
              <Collapse
                defaultActiveKey={['1']}
                expandIconPosition="right"
                className="space-y-2 !border-none bg-transparent"
              >
                <Panel header={<PanelTitle>Add Variant</PanelTitle>} key="1" className=" ">
                  {values?.variants?.map((variant, id) => {
                    return (
                      <div key={id}>
                        <FormFieldWrapper>
                          <Form.Item className="!w-full" label={<FormFieldTitle>Weight</FormFieldTitle>}>
                            <Input
                              size="large"
                              type="number"
                              name={`variants[${id}].weight`}
                              placeholder=""
                              onChange={handleChange}
                              value={variant.weight}
                            />
                          </Form.Item>
                          <Form.Item
                            className="!w-full"
                            label={<p className="font-semibold text-[#6B7280]">Product Model</p>}
                          >
                            <Input
                              size="large"
                              type="text"
                              name={`variants[${id}].product_model`}
                              placeholder=""
                              onChange={handleChange}
                              value={variant.product_model}
                            />
                          </Form.Item>
                          <Form.Item className="!w-full" label={<FormFieldTitle>Size</FormFieldTitle>}>
                            <Select
                              size="large"
                              className="!w-full"
                              placeholder="select"
                              value={variant.size}
                              // loading={stateQueries.isLoading}
                              onChange={value => setFieldValue(`variants[${id}].size`, value)} // Handle Select change
                              options={[
                                {
                                  label: 'large',
                                  value: 'large'
                                },
                                {
                                  label: 'medium',
                                  value: 'medium'
                                }
                              ]}
                              showSearch
                              optionFilterProp="children"
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              filterOption={(input, option: any) =>
                                (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
                              }
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              filterSort={(optionA: any, optionB: any) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                              }
                            />
                          </Form.Item>
                        </FormFieldWrapper>

                        <FormFieldWrapper>
                          <Form.Item className="!w-full" label={<FormFieldTitle>Price</FormFieldTitle>}>
                            <Input
                              size="large"
                              type="number"
                              name={`variants[${id}].price`}
                              placeholder=""
                              onChange={handleChange}
                              value={variant.price}
                            />
                          </Form.Item>

                          <Form.Item className="!w-full" label={<FormFieldTitle>Color</FormFieldTitle>}>
                            <Select
                              size="large"
                              className="!w-full"
                              placeholder="select"
                              value={variant.color}
                              // loading={stateQueries.isLoading}
                              onChange={value => setFieldValue(`variants[${id}].color`, value)} // Handle Select change
                              options={[
                                {
                                  label: 'blue',
                                  value: 'blue'
                                },
                                {
                                  label: 'red',
                                  value: 'red'
                                }
                              ]}
                              showSearch
                              optionFilterProp="children"
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              filterOption={(input, option: any) =>
                                (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())
                              }
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              filterSort={(optionA: any, optionB: any) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                              }
                            />
                          </Form.Item>

                          <Form.Item className="!w-full" label={<FormFieldTitle>Discount</FormFieldTitle>}>
                            <Input
                              addonBefore={'%'}
                              size="large"
                              type="text"
                              name={`variants[${id}].discount`}
                              placeholder=""
                              onChange={handleChange}
                              value={variant.discount}
                            />
                          </Form.Item>
                        </FormFieldWrapper>
                      </div>
                    )
                  })}
                </Panel>
              </Collapse>
            </StyledContentWrapper>
          )}
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex gap-3">
              <Button
                style={{
                  backgroundColor: '#6B7280',
                  color: '#fff',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                htmlType="button"
                className="w-full whitespace-nowrap rounded-lg bg-[#6B7280] px-4 py-[22px] text-[#fff] md:w-[140px]"
              >
                Save to Draft
              </Button>

              <Button
                style={{
                  backgroundColor: '#34C759',
                  color: '#fff',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                htmlType="submit"
                className="w-[140px] whitespace-nowrap rounded-lg bg-[#34C759] px-4 py-[22px] text-[#fff]"
              >
                Add New Product
              </Button>
            </div>

            <Button
              style={{
                backgroundColor: '#000000',
                color: '#fff',
                border: 'none',
                // Force the styles to remain the same on hover
                transition: 'none' // Disable any transitions
              }}
              htmlType="button"
              className="w-[140px] whitespace-nowrap rounded-lg bg-[#000000] px-4 py-[22px] text-white"
            >
              Publish
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

const FormFieldWrapper = styled(tw.div`w-full flex flex-col gap-4 md:flex-row`)``

const FormFieldTitle = styled(tw.p`font-semibold text-[14px]  text-[#6B7280]`)``
const PanelTitle = tw.p`text-[20px] font-bold text-[#6B7280]`

export default BulkUploadForm
