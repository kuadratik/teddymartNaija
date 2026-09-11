import TextComponent from '@/components/SharedUI/TextComponent'
import {Card, Col, Row} from 'antd'
import React from 'react'
import {FormFieldWrapper, PanelTitle} from '../BulkUploadForm'
import ProductIImageFile from '../ProductImage'

interface ImageGalleryProps {
  values: any
  setFieldValue: any
  sidebarArr: any[]
  uploadedFiles: {id: number; file: string}[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<{id: number; file: string}[]>>
  updateUploadedFileAtPosition: (position: number, newFile: string) => void
  fileList: any[]
  setFileList: React.Dispatch<React.SetStateAction<any[]>>
  errors: any
  editMode?: boolean
}

const ImageGallery = ({
  values,
  setFieldValue,
  sidebarArr,
  uploadedFiles,
  setUploadedFiles,
  updateUploadedFileAtPosition,
  fileList,
  setFileList,
  errors,
  editMode = false
}: ImageGalleryProps) => {
  return (
    <Card
      style={{border: '1px solid #EDECF0'}}
      title={
        <PanelTitle>
          <TextComponent as="span" className="text-[18px] font-semibold text-[#6B7280]">
            Image Gallery
          </TextComponent>
        </PanelTitle>
      }
      className="rounded-lg shadow-none"
    >
      <FormFieldWrapper>
        <Row
          gutter={16}
          className={`flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-6 ${sidebarArr?.length ? 'xl:grid-cols-3' : 'xl:grid-cols-4'}`}
        >
          {uploadedFiles.map((item, index) => (
            <Col key={item.id} xs={24} sm={12} md={12} lg={8} xl={6}>
              <ProductIImageFile
                placeholder={`Upload product image ${index + 1} under 5MB in PNG, JPEG, or JPG format. Dimensions must not exceed 1080x1080 pixels.`}
                uploadedDetails={fileList[index].file}
                setUploadedDetails={(file: File | null) => {
                  const updatedFileList = [...fileList]
                  updatedFileList[index] = {
                    ...updatedFileList[index],
                    file: file
                  }
                  setFileList(updatedFileList)
                }}
                uploadedFile={item.file}
                setUploadedFile={(file: string) => {
                  // Use the new updateUploadedFileAtPosition function
                  updateUploadedFileAtPosition(item.id, file)
                }}
                className="h-[200px] w-full"
                accept=".jpg, .jpeg, .png"
                id={`file-upload-${index}`}
                errorText="File dimensions must not exceed 1080x1080 pixels."
                widthLimit={6000}
                heightLimit={6000}
                editMode={editMode}
                externalError={errors.images !== undefined}
              />
            </Col>
          ))}
        </Row>
        {errors.images && (
          <p className="mt-[2px] flex flex-col gap-1 text-xs text-[#FF4A4A]">Add at least one product image</p>
        )}
      </FormFieldWrapper>
    </Card>
  )
}

export default ImageGallery
