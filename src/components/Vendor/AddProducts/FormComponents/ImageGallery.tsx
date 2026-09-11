import {StyledContentWrapper} from '@/pages/ads-gallery/[id]'
import {Collapse} from 'antd'
import React, {useState} from 'react'
import ProductIImageFile from '../ProductImage'
import {FormFieldTitle} from '../BulkUploadForm'
import {BulkUploadProductType} from '../../utils'
import {FormikErrors} from 'formik'

type ImageGalleryProps = {
  values: BulkUploadProductType
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<BulkUploadProductType>>
  sidebarArr: any[]
  uploadedFiles: {id: number; file: string}[]
  setUploadedFiles: React.Dispatch<
    React.SetStateAction<
      {
        id: number
        file: string
      }[]
    >
  >
  fileList: any[]
  setFileList: React.Dispatch<React.SetStateAction<any[]>>
  errors: any
  editMode?: boolean
}

const {Panel} = Collapse

const ImageGallery = ({
  values,
  setFieldValue,
  sidebarArr,
  uploadedFiles,
  setUploadedFiles,
  fileList,
  setFileList,
  errors,
  editMode = false
}: ImageGalleryProps) => {
  const [firstFile, setFirstFile] = useState<string | null>(null)
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)

  return (
    <StyledContentWrapper>
      {' '}
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="right"
        collapsible="icon"
        className="space-y-2 !border-none bg-transparent"
      >
        <Panel header={<p className="text-[20px] font-bold text-[#6B7280]">Image Gallery</p>} key="4" className=" ">
          <p className="flex flex-col gap-1 text-xs text-red-600">{errors && errors.images ? errors.images : ''}</p>
          <div
            className={`mt-[20px] flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-6 ${sidebarArr?.length ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}
          >
            {fileList.map((file, index) => (
              <div className="" key={index}>
                <ProductIImageFile
                  errorText={''}
                  id="image-upload"
                  className="relative"
                  accept=".png, .jpeg, .jpg, .webp"
                  title={<FormFieldTitle>Product Image {file.id === 1 ? '1*' : String(file.id)}</FormFieldTitle>}
                  placeholder={'PNG, JPG, JPEG, WEBP (max. 1080×1080px)'}
                  uploadedDetails={file.file}
                  setUploadedDetails={e => {
                    // update the fileList based on the id
                    const newFileList = fileList.map(item => {
                      if (item.id === file.id) {
                        return {
                          id: item.id,
                          file: e,
                          base64: item.base64
                        }
                      }
                      return item
                    })

                    setFileList(newFileList)
                  }}
                  uploadedFile={
                    editMode
                      ? values?.images?.length
                        ? values?.images[file.id - 1]
                        : uploadedFiles.find(item => item.id === file.id)?.file || ''
                      : ''
                  }
                  setUploadedFile={(e: string) => {
                    // update the fileList based on the id

                    const newUploadedFiles = uploadedFiles.map(item => {
                      if (item.id === file.id) {
                        return {
                          id: item.id,
                          file: e
                        }
                      }
                      return item
                    })

                    setUploadedFiles(newUploadedFiles)
                  }}
                  heightLimit={10800000000}
                  widthLimit={1080000000000}
                  editMode={editMode && (values.images ?? [])[file.id - 1] !== undefined}
                  disabled={
                    file.id !== 1
                      ? fileList[file.id - 2].file === '' ||
                        fileList[file.id - 2].file === null ||
                        fileList[file.id - 2].file === undefined
                      : false
                  }
                />
              </div>
            ))}
          </div>
        </Panel>
      </Collapse>
    </StyledContentWrapper>
  )
}

export default ImageGallery
