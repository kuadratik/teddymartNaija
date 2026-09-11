import CustomButton from '@/components/SharedUI/Buttons/Button'
import CountryInput from '@/components/SharedUI/Input/CountryInput'
import SelectInput from '@/components/SharedUI/Input/SelectInput'
import StateInput from '@/components/SharedUI/Input/StateInput'
import TextInput from '@/components/SharedUI/Input/TextInput'
import PhoneInputWithCountry from '@/components/SharedUI/PhoneInputWithCountry'
import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import {Form} from 'antd'

import {useCallback, useEffect} from 'react'
import CurrencyInput from 'react-currency-input-field'
import {useQuill} from 'react-quilljs'
import NewDragDrop from './NewDragDrop'
import PlansContainer from './PlansContainer'

interface IProps {
  handleSubmit: () => void
  handleChange: (e: any) => void
  setFieldValue: (field: string, value: any) => void
  values: any
  error: any
  selectedLanguage: any
  selectedPrice: any
  allCategories: any
  setSelectedPrice: any
  priceOptions: any
  handleAdvertCreation: any
  advertPlans: any
  advertPlansLoading: boolean
  errors: any
  isCreateAdvertLoading: boolean
  setFileList: any
  fileList: any
  setUploadedFiles: any
  uploadedFiles: any
  payment?: any
  adsInfo?: any
  dragListener?: boolean
  isEdit: boolean
}
const PostAdForm = ({
  error,
  handleChange,
  handleSubmit,
  setFieldValue,
  values,
  allCategories,
  advertPlans,
  advertPlansLoading,
  setSelectedPrice,
  errors,
  handleAdvertCreation,
  priceOptions,
  selectedLanguage,
  selectedPrice,
  fileList,
  isCreateAdvertLoading,
  setFileList,
  setUploadedFiles,
  payment,
  uploadedFiles,
  dragListener,
  isEdit,
  adsInfo
}: IProps) => {
  console.log('🚀 ~ uploadedFiles:', uploadedFiles)

  const {quill, quillRef} = useQuill({
    placeholder: 'Description*',
    modules: {
      toolbar: [['bold', 'italic', 'underline', 'strike'], [{list: 'ordered'}, {list: 'bullet'}], ['clean']]
    }
  })

  const MAX_DESCRIPTION_LENGTH = 500

  // Set initial content if in edit mode and values.description exists
  useEffect(() => {
    if (quill && values.description && quill.clipboard && !quill.hasFocus()) {
      quill.clipboard.dangerouslyPasteHTML(values.description)
    }
  }, [quill, values.description])

  // Memoized function to enforce character limit
  const enforceCharacterLimit = useCallback(() => {
    if (!quill) return

    // Get plain text without HTML tags
    const text = quill.getText().trim()

    // If text exceeds maxLength
    if (text.length > MAX_DESCRIPTION_LENGTH) {
      // Save selection before modifications
      const selection = quill.getSelection()

      // Disable the text-change event temporarily to prevent infinite loop
      quill.off('text-change')

      // Calculate how many chars to delete
      const deleteCount = text.length - MAX_DESCRIPTION_LENGTH

      // Get the position where to truncate
      if (deleteCount > 0) {
        // Delete the excess characters from the end of the selection
        const currentPosition = selection ? selection.index : text.length

        // If the cursor is at the end of excess content, move it back
        if (selection && selection.index > MAX_DESCRIPTION_LENGTH) {
          // Delete from the cursor position
          quill.deleteText(MAX_DESCRIPTION_LENGTH, currentPosition)
        } else {
          // Delete from the end
          quill.deleteText(text.length - deleteCount, text.length)
        }
      }

      // Re-enable the text-change event handler
      quill.on('text-change', enforceCharacterLimit)

      // Update the form field with the truncated content
      setFieldValue('description', quill.root.innerHTML)
    } else {
      // If within limits, update normally
      setFieldValue('description', quill.root.innerHTML)
    }
  }, [quill, setFieldValue])

  // Update form values when quill content changes
  useEffect(() => {
    if (quill) {
      quill.on('text-change', enforceCharacterLimit)

      // Cleanup function
      return () => {
        quill.off('text-change', enforceCharacterLimit)
      }
    }
  }, [quill, enforceCharacterLimit])

  // Prevent cursor position issues by avoiding re-renders that could affect the editor
  const characterCount = quill ? quill.getText().trim().length : 0

  return (
    <Form
      className="mx-auto flex w-full max-w-[644px] flex-col items-center justify-center gap-[47px]"
      onFinish={handleSubmit}
      layout="vertical"
    >
      <TextComponent as="h1" className="text-[24px] font-bold leading-[31px] text-[#141414]">
        Post your Ad on AfricanDiasporaMart! It is Quick and Easy.
      </TextComponent>

      <div className="flex w-full flex-col gap-[34px]">
        <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
          1. Ad Details
        </TextComponent>

        <div className="flex w-full flex-col gap-4">
          <TextInput
            placeholder={`Ad Title*`}
            onChange={e => {
              if (e.target.value.length <= 75) {
                handleChange(e)
              }
            }}
            name={'title'}
            type={'text'}
            value={values.title}
            errorMessage={
              (error as any)?.data?.errors?.title ? (error as any)?.data?.errors?.title.map((err: any) => err) : ''
            }
          />

          <SelectInput
            placeholder="Category*"
            data={allCategories}
            value={
              values.category_id ? allCategories.find((cat: any) => cat.value === values.category_id)?.value : null
            }
            onChange={e => {
              setFieldValue('category_id', e)
            }}
            disabled={false}
            notFoundContent={'Category not found'}
            errorMessage={(error as any)?.data?.errors?.category_id ? 'The category field is required' : ''}
          />

          <TextInput
            placeholder={`Quantity`}
            onChange={e => {
              const value = e.target.value

              if (value === '' || /^[0-9]+\.?([0-9]+)?$/.test(value)) {
                handleChange(e)
              }
            }}
            name={'quantity'}
            type={'text'}
            value={values.quantity}
            errorMessage={
              (error as any)?.data?.errors?.quantity
                ? (error as any)?.data?.errors?.quantity.map((err: any) => err)
                : ''
            }
          />

          {/* Rich Text Editor for Description */}
          <div className="flex w-full flex-col">
            <div style={{height: 150}}>
              <div className="rounded-b-md" ref={quillRef} />
            </div>
            {(error as any)?.data?.errors?.description && (
              <TextComponent as="span" className="mt-1 text-[13px] leading-[16px] text-red-600">
                {(error as any)?.data?.errors?.description.map((err: any) => err)}
              </TextComponent>
            )}
            <div className="relative right-2 top-5 text-right text-xs text-gray-500">{`${characterCount}/500 characters`}</div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-[34px]">
        <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
          2. Price*
        </TextComponent>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-[22px]">
            {priceOptions.map((price: any, index: number) => (
              <div key={index} className="flex w-full items-center gap-4">
                <div
                  className="h-6 w-6 cursor-pointer rounded-full border-[2px] border-custom_grey p-1"
                  onClick={() => {
                    setSelectedPrice(index)
                  }}
                >
                  {selectedPrice === index && <div className="h-full w-full rounded-full bg-custom_grey"></div>}
                </div>
                {index === 0 ? (
                  <div className="relative flex !w-full flex-1 flex-col">
                    <p className="absolute right-8 top-2 z-20 text-lg font-semibold text-[#6B7280]">
                      {selectedLanguage?.currencySign}
                    </p>

                    <CurrencyInput
                      id={'price'}
                      name={'price'}
                      placeholder={'Price*'}
                      className={`w-full rounded-[8px] border ${errors && errors.price ? 'border-red-600' : 'border-gray-300'} bg-[#F9FAFB] px-[15px] py-[11px] text-[#141414] shadow-f1 placeholder:font-medium hover:border-[#000000] focus:outline-none focus:ring-1 focus:ring-[#000000]`}
                      value={values.price}
                      decimalsLimit={2}
                      onValueChange={(value: string | undefined, name?: string) => {
                        setFieldValue('price', value)
                      }}
                      disabled={false}
                      // required={required}
                      groupSeparator=","
                      maxLength={7}
                      max={7}
                    />
                    {(error as any)?.data?.errors?.price ? (
                      <TextComponent as="span" className="text-[13px] leading-[16px] text-red-600">
                        The price field is required
                      </TextComponent>
                    ) : (
                      ''
                    )}
                  </div>
                ) : (
                  <TextComponent as="span" className="text-[13px] leading-[16px] text-[#6B7280]">
                    {price.label}
                  </TextComponent>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-[9px]">
        <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
          3. Media*
        </TextComponent>
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-[9px]">
            <TextComponent as="span" className="text-[14px] leading-[18px] text-[#6B7280]">
              Include at least 1 to 3 photos for this Ad. The first photo will be used as the primary image. You can
              rearrange the order of your photos by a simple drag and drop.
            </TextComponent>
            {(error as any)?.data?.errors?.media ? (
              <TextComponent as="span" className="text-[13px] leading-[16px] text-red-600">
                The media field is required
              </TextComponent>
            ) : (
              ''
            )}
          </div>
        </div>
        <NewDragDrop
          adsInfo={adsInfo}
          dragListener={dragListener}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          fileList={fileList}
          setFileList={setFileList}
        />
        {/* <NewDragDrop
                uploadedFiles={uploadedFiles}
                setUploadedFiles={memoizedSetUploadedFiles}
                fileList={fileList}
                setFileList={memoizedSetFileList}
              /> */}
      </div>

      <div className="flex w-full flex-col gap-[34px]">
        <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
          4. Location*
        </TextComponent>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-[22px]">
            <CountryInput
              placeholder={'Country'}
              errorMessage={(error as any)?.data?.errors?.country_id ? 'The country field is required' : ''}
              className={`border-[1px] ${errors.country_id ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              value={values?.country_id ?? undefined}
              onChange={value => {
                setFieldValue('country_id', value)
              }}
            />

            <StateInput
              className={`border-[1px] ${errors.state ? 'border-red-600' : 'border-gray-200'} bg-[#F5F5F5]`}
              errorMessage={
                (error as any)?.data?.errors?.state ? (error as any)?.data?.errors?.state.map((err: any) => err) : ''
              }
              //   @ts-ignore
              countryId={values.country_id}
              value={values.state ?? undefined}
              onChange={value => {
                setFieldValue('state', value)
              }}
              placeholder="State/Province"
              disabled={!values.country_id}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-[34px]">
        <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
          5. Contact Information*
        </TextComponent>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-[22px]">
            <PhoneInputWithCountry
              errorMessage={
                (error as any)?.data?.errors?.phone_number
                  ? (error as any)?.data?.errors?.phone_number.map((err: any) => err)
                  : ''
              }
              title=""
              inputProps={{
                name: 'phone_number',
                id: 'phone_number'
              }}
              placeholder={''}
              disabled={false}
              fontSize={14}
              color={'#3D3D3D'}
              value={values.phone_number}
              onChange={e => {
                setFieldValue('phone_number', e)
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-[34px]">
        <TextComponent as="h2" className="text-[24px] font-bold leading-[31px] text-[#141414]">
          6. Promote your Ad!*
        </TextComponent>

        <PlansContainer
          payment={payment}
          loading={advertPlansLoading}
          advertPlans={advertPlans?.data || []}
          selectedPlanId={values.promote_plan_id}
          onSelectPlan={id => setFieldValue('promote_plan_id', id)}
          errorMessage={(error as any)?.data?.errors?.promote_plan_id ? 'Please select a plan' : ''}
        />
      </div>

      <CustomButton
        onClick={() => {
          handleAdvertCreation()
        }}
        disabled={isCreateAdvertLoading}
        type="button"
        className="w-full rounded-[10px] border border-black bg-[#000] px-1 py-4 text-[14px] text-white hover:bg-black"
      >
        {isCreateAdvertLoading ? <Spinner /> : 'Post Ad'}
      </CustomButton>
    </Form>
  )
}

export default PostAdForm
