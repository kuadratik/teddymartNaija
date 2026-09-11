import {StyledContentWrapper} from '@/pages/ads-gallery/[id]'
import {Button, Collapse, Input, Popconfirm, Radio, RadioChangeEvent} from 'antd'
import React, {useState} from 'react'
import {BulkUploadProductType} from '../../utils'
import {FormikErrors} from 'formik'
import EditableTable, {DataType} from '@/components/EditableTable'
import ProductIImageFile from '../ProductImage'
import {FormFieldTitle} from '../BulkUploadForm'
import PlannerModal from '@/components/SharedUI/ModalComponent'
import DummySizeChart from './DummySizeChart'

type SizeChartProps = {
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
  dataSource: DataType[]
  setDataSource: React.Dispatch<React.SetStateAction<DataType[]>>
  columns: (
    | {
        title: string
        dataIndex: string
        width: string
        editable: boolean
        render?: undefined
      }
    | {
        title: string
        dataIndex: string
        editable: boolean
        width?: undefined
        render?: undefined
      }
    | {
        title: string
        dataIndex: string
        render: (_: any, record: any) => React.JSX.Element | null
        width?: undefined
        editable?: undefined
      }
  )[]

  setColumns: React.Dispatch<
    React.SetStateAction<
      (
        | {
            title: string
            dataIndex: string
            width: string
            editable: boolean
            render?: undefined
          }
        | {
            title: string
            dataIndex: string
            editable: boolean
            width?: undefined
            render?: undefined
          }
        | {
            title: string
            dataIndex: string
            render: (_: any, record: any) => React.JSX.Element | null
            width?: undefined
            editable?: undefined
          }
      )[]
    >
  >
  sizeChartFormat: number
  setSizeChartFormat: React.Dispatch<React.SetStateAction<number>>
  editMode?: boolean
}

const {Panel} = Collapse

const SizeChart = ({
  values,
  setFieldValue,
  handleChange,
  dataSource,
  setDataSource,
  columns,
  setColumns,
  sizeChartFormat,
  setSizeChartFormat,
  editMode = false
}: SizeChartProps) => {
  const [firstFile, setFirstFile] = useState<string | null>(null)
  const [uploadedDetails, setUploadedDetails] = useState<File | null>(null)
  const [showChartModal, setShowChartModal] = useState(false)

  console.log('sizeChartFormat', sizeChartFormat)

  const onChange = (e: RadioChangeEvent) => {
    setSizeChartFormat(e.target.value)
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
        <Panel header={<p className="text-[20px] font-bold text-[#6B7280]">Size Chart</p>} key="2" className=" ">
          <div className={`flex w-full flex-col gap-8`}>
            <div className="flex w-full items-center gap-5">
              <Input
                size="large"
                type="text"
                name={'size_chart_title'}
                placeholder="Size Chart Title"
                onChange={handleChange}
                value={values.size_chart_title}
                className="h-[54px] text-[14px] font-semibold leading-[18px] placeholder:font-semibold placeholder:text-black"
              />

              <Button
                style={{
                  backgroundColor: '#000',
                  color: '#fff',
                  border: 'none',
                  // Force the styles to remain the same on hover
                  transition: 'none' // Disable any transitions
                }}
                htmlType="button"
                onClick={() => setShowChartModal(true)}
                className="whitespace-nowrap rounded-lg bg-[#000] px-4 py-[22px] text-[#fff]"
              >
                View Sample Size Chart
              </Button>
            </div>
            <div className="flex w-full flex-col gap-5">
              <div className="flex w-full items-center gap-[52px]">
                <Radio.Group onChange={onChange} value={sizeChartFormat}>
                  <Radio value={1}>Create Chart</Radio>
                  <Radio value={2}>Upload</Radio>
                </Radio.Group>
              </div>

              <div className="w-full">
                {sizeChartFormat === 1 ? (
                  <EditableTable
                    dataSource={dataSource}
                    setDataSource={setDataSource}
                    columns={columns}
                    setColumns={setColumns}
                  />
                ) : sizeChartFormat === 2 ? (
                  <ProductIImageFile
                    errorText={''}
                    id="image-upload"
                    accept=".png, .jpeg, .jpg, .webp"
                    title={<FormFieldTitle>Upload Size Chart</FormFieldTitle>}
                    placeholder={'PNG, JPG, JPEG, WEBP (max. 1080×1080px)'}
                    uploadedDetails={uploadedDetails}
                    setUploadedDetails={e => {
                      setUploadedDetails(e)
                    }}
                    uploadedFile={firstFile}
                    setUploadedFile={(e: string) => {
                      setFirstFile(e)
                      setFieldValue('first_upload', e)
                    }}
                    heightLimit={10800000000}
                    widthLimit={1080000000000}
                    className="w-full"
                  />
                ) : (
                  ''
                )}
              </div>

              {showChartModal && (
                <PlannerModal
                  modalOpen={showChartModal}
                  setModalOpen={setShowChartModal}
                  maskCloseable={true}
                  onCloseModal={() => setShowChartModal(false)}
                >
                  <DummySizeChart />
                </PlannerModal>
              )}
            </div>
          </div>
        </Panel>
      </Collapse>
    </StyledContentWrapper>
  )
}

export default SizeChart
