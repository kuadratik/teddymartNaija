import {StyledContentWrapper} from '@/pages/ads-gallery/[id]'
import {Collapse, Form, Input, Select, Tag} from 'antd'
import React, {useState} from 'react'
import {FormFieldTitle, FormFieldWrapper, onPreventMouseDown, units} from '../BulkUploadForm'
import {CloseOutlined} from '@ant-design/icons'
import {BulkUploadProductType} from '../../utils'
import {FormikErrors, FormikTouched} from 'formik'

type ProductAttributesProps = {
  values: BulkUploadProductType
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<BulkUploadProductType>>
  handleChange: {
    (e: React.ChangeEvent<any>): void
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void
  }
  editMode?: boolean
}

const {Panel} = Collapse

const {Option} = Select

const ProductAttributes = ({values, handleChange, setFieldValue, editMode = false}: ProductAttributesProps) => {
  const handleInputConfirm = (): any => {
    if (values.tagText && values.tags.indexOf(values.tagText) === -1) {
      setFieldValue('tags', [...values.tags, values.tagText])
    }
    setFieldValue('tagText', '')
  }

  const handleSizeInputConfirm = (): any => {
    if (values.sizeText && values.size.indexOf(values.sizeText) === -1) {
      setFieldValue('size', [...values.size, values.sizeText])
    }
    setFieldValue('sizeText', '')
  }

  const handleClose = (removedTag: string) => {
    const newTags = values.tags.filter(tag => tag !== removedTag)
    setFieldValue('tags', newTags)
  }

  const handleSizeClose = (removedTag: string) => {
    const newSizeTags = values.size.filter(tag => tag !== removedTag)
    setFieldValue('size', newSizeTags)
  }

  return (
    <StyledContentWrapper>
      {' '}
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="right"
        collapsible="icon"
        className="space-y-2 !border-none bg-transparent"
      >
        <Panel
          header={<p className="text-[20px] font-bold text-[#6B7280]">Product Attributes</p>}
          key="2"
          className="!border-none"
        >
          <FormFieldWrapper className="gap-7">
            <Form.Item className="!w-full" label={<FormFieldTitle>Measurement</FormFieldTitle>}>
              <Input
                size="large"
                type="text"
                prefix={
                  <div
                    className="mr-2 flex h-[54px] w-[124px] items-center justify-center bg-[#F3F3F3]"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                  >
                    <Select
                      variant="borderless"
                      value={values.measurement[0]?.unit}
                      className="!bg-transparent !text-white"
                      onChange={(value: string) => {
                        setFieldValue('measurement', [
                          {
                            unit: value,
                            value: values.measurement[0]?.value
                          }
                        ])
                      }}
                    >
                      {units.map((unit, index) => (
                        <Option
                          className="!bg-transparent hover:!bg-black hover:!text-white"
                          value={unit.name}
                          key={index}
                        >
                          {`${unit.name} (${unit.abbreviation})`}
                        </Option>
                      ))}
                    </Select>
                  </div>
                }
                name={'measurement'}
                placeholder=""
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value

                  // only add the unitValue at the end of the total value and not after each value change
                  setFieldValue('measurement', [
                    {
                      unit: values.measurement[0]?.unit,
                      value
                    }
                  ])
                }}
                value={values.measurement[0]?.value}
                className="h-[54px] overflow-hidden rounded p-0"
              />
            </Form.Item>
            <Form.Item className="!w-full" label={<FormFieldTitle>Product Model</FormFieldTitle>}>
              <Input
                size="large"
                type="text"
                name={'product_model'}
                placeholder=""
                onChange={handleChange}
                value={values.product_model}
                className="h-[54px] rounded"
              />
            </Form.Item>
            <Form.Item
              label={<FormFieldTitle>Brand</FormFieldTitle>}
              className="!w-full"
              // help={touched.brand && errors.brand ? errors.brand : ''}
              // validateStatus={touched.brand && errors.brand ? 'error' : undefined}
            >
              <Input
                size="large"
                type="text"
                name={'brand'}
                placeholder=""
                onChange={handleChange}
                value={values.brand}
                className="h-[54px] rounded"
              />
            </Form.Item>
          </FormFieldWrapper>
          <FormFieldWrapper className="gap-7">
            <Form.Item className="!w-full" label={<FormFieldTitle>Material</FormFieldTitle>}>
              <Input
                size="large"
                type="text"
                name={'material'}
                placeholder=""
                onChange={handleChange}
                value={values.material}
                className="h-[54px] rounded"
              />
            </Form.Item>

            <Form.Item className="!w-full" label={<FormFieldTitle>Color</FormFieldTitle>}>
              <Input
                size="large"
                type="text"
                name={'color'}
                placeholder=""
                onChange={handleChange}
                value={values.color}
                className="h-[54px] rounded"
              />
            </Form.Item>
          </FormFieldWrapper>

          <FormFieldWrapper className="lg:gap-7">
            <Form.Item className="!w-full" label={<FormFieldTitle>Size</FormFieldTitle>}>
              <Input
                size="large"
                type="text"
                name={'sizeText'}
                placeholder="e.g small , medium, size 45"
                onChange={handleChange}
                value={values.sizeText}
                onPressEnter={handleSizeInputConfirm}
                onBlur={handleSizeInputConfirm}
                className="h-[54px] rounded"
              />

              {values.size.length ? (
                <div className="mb-6 mt-5 flex flex-wrap gap-2">
                  {' '}
                  {values?.size?.map((value, index) => {
                    return (
                      <Tag
                        closable
                        closeIcon={<CloseOutlined style={{fontSize: '14px', color: '#0077B5'}} />}
                        onClose={e => {
                          e.preventDefault()
                          handleSizeClose(value)
                        }}
                        style={{marginRight: 5, marginLeft: 5}}
                        className="flex items-center rounded-[7px] !border-none bg-[#EBF4F9] p-1 px-3 text-[#0077B5]"
                        onMouseDown={onPreventMouseDown}
                        key={index}
                      >
                        <div className="mr-1 p-1 text-sm font-semibold">{value}</div>
                      </Tag>
                    )
                  })}
                </div>
              ) : (
                ''
              )}
            </Form.Item>

            <Form.Item label={<FormFieldTitle>Add Tags</FormFieldTitle>} className="!w-full">
              <Input
                size="large"
                type="text"
                name={'tagText'}
                placeholder=""
                onChange={handleChange}
                value={values.tagText}
                onPressEnter={handleInputConfirm}
                onBlur={handleInputConfirm}
                className="h-[54px] rounded"
              />

              {values.tags.length ? (
                <div className="mb-6 mt-5 flex flex-wrap gap-2">
                  {' '}
                  {values?.tags?.map((value, index) => {
                    return (
                      <Tag
                        closable
                        closeIcon={<CloseOutlined style={{fontSize: '14px', color: '#0077B5'}} />}
                        onClose={e => {
                          e.preventDefault()
                          handleClose(value)
                        }}
                        style={{marginRight: 5, marginLeft: 5}}
                        className="flex items-center rounded-[7px] !border-none bg-[#EBF4F9] p-1 px-3 text-[#0077B5]"
                        onMouseDown={onPreventMouseDown}
                        key={index}
                      >
                        <div className="mr-1 p-1 text-sm font-semibold">{value}</div>
                      </Tag>
                    )
                  })}
                </div>
              ) : (
                ''
              )}
            </Form.Item>
          </FormFieldWrapper>
        </Panel>
      </Collapse>
    </StyledContentWrapper>
  )
}

export default ProductAttributes
