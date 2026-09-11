import React, {isValidElement, useEffect, useRef} from 'react'

import {FileExcelOutlined, PrinterOutlined} from '@ant-design/icons'
import {Icon} from '@iconify/react'
import {Button, message, Table} from 'antd'
import * as XLSX from 'xlsx'
import PlannerModal from './ModalComponent'

interface IProps {
  data: any
  formValues: any
  columnsTable: any
  refetch: () => void
  deleteRowApi: any
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
  showDeleteModal: boolean
  isDeleteLoading: boolean
  transformedData: any
  isLoading: boolean
  DeleteModalText: React.ReactNode
  deleteSuccessMessage?: string
  deleteErrorMessage?: string
  bordered?: boolean
  firstRowClassName?: string
  secondRowClassName?: string
  showPrintButton?: boolean
  printTitle?: string
  showExportButton?: boolean
  exportColumns?: any
  DeleteModalComponent?: React.ReactNode
  transparentRows?: boolean
  rowOpacity?: number // 0-1 for transparency level (e.g., 0.2 for 20% opacity)
  showScrollButtons?: boolean
}
const TableMainComponent = ({
  data,
  refetch,
  deleteRowApi,
  setShowDeleteModal,
  showDeleteModal,
  isDeleteLoading,
  isLoading,
  transformedData,
  DeleteModalText,
  deleteSuccessMessage = 'Item deleted successfully',
  deleteErrorMessage = 'Item deletion failed',
  columnsTable,
  bordered = false,
  firstRowClassName = '',
  secondRowClassName = '',
  showPrintButton = false,
  printTitle = 'Table Report',
  showExportButton = false,
  exportColumns = [],
  DeleteModalComponent,
  transparentRows = false,
  rowOpacity = 0.2,
  showScrollButtons = true
}: IProps) => {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const scrollTargetRef = useRef<HTMLElement | null>(null)

  // Add custom table styling similar to SlugHistoryTable
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'table-main-component-styles'
    style.textContent = `
      .table-main-component-wrapper {
        border-radius: 16px;
        border: 1px solid white;
        background: ${transparentRows ? `rgba(255, 255, 255, ${rowOpacity})` : 'rgba(255, 255, 255, 0.2)'};
        backdrop-filter: blur(8px);
        transition: box-shadow 0.3s ease;
      }
      
      .table-main-component-wrapper:hover {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      }
      
      .table-main-component .ant-table {
        background: transparent !important;
      }
      
      .table-main-component .ant-table-wrapper {
        border-radius: 12px;
        background: white;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      }
      
      .table-main-component .ant-table-thead > tr > th {
        background: #000 !important;
        color: #fff !important;
        font-weight: 600 !important;
        font-size: 13px !important;
        padding: 16px !important;
        border-right: 1px solid white !important;
      }
      
      .table-main-component .ant-table-thead > tr > th:last-child {
        border-right: none !important;
      }
      
      .table-main-component .ant-table-thead > tr > th:first-child {
        border-bottom-left-radius: 12px;
      }
      
      .table-main-component .ant-table-thead > tr > th:last-child {
        border-bottom-right-radius: 12px;
      }
      
      .table-main-component .ant-table-tbody > tr {
        transition: background-color 0.2s ease;
      }
      
      .table-main-component .ant-table-tbody > tr:hover {
        background: rgb(249 250 251) !important;
      }
      
      .table-main-component .ant-table-tbody > tr > td {
        font-size: 13px !important;
        color: #111827 !important;
        padding: 16px !important;
        border-bottom: 1px solid #e5e7eb !important;
      }
      
      .table-main-component .ant-table-tbody > tr:last-child > td {
        border-bottom: none !important;
      }
      
      .table-main-component-transparent .ant-table-tbody > tr {
        background: ${transparentRows ? `rgba(255, 255, 255, ${rowOpacity}) !important` : 'transparent !important'};
      }
      
      .table-main-component-transparent .ant-table-tbody > tr:nth-child(even) {
        background: ${transparentRows ? `rgba(232, 232, 232, ${rowOpacity}) !important` : 'rgba(232, 232, 232, 0.2) !important'};
      }
      
      .table-scroll-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background: #000;
        color: white;
        border-radius: 9999px;
        padding: 8px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        opacity: 0.5;
        transition: all 0.3s ease;
        cursor: pointer;
        border: none;
      }
      
      .table-scroll-button:hover {
        opacity: 1;
        background: #374151;
        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
      }
      
      .table-scroll-button-left {
        left: 8px;
      }
      
      .table-scroll-button-right {
        right: 8px;
      }
    `

    // Remove existing style if present
    const existingStyle = document.getElementById('table-main-component-styles')
    if (existingStyle) {
      existingStyle.remove()
    }

    document.head.appendChild(style)

    return () => {
      const styleToRemove = document.getElementById('table-main-component-styles')
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [transparentRows, rowOpacity])

  useEffect(() => {
    if (!tableContainerRef.current) {
      scrollTargetRef.current = null
      return
    }

    const potentialSelectors = ['.ant-table-content', '.ant-table-body', '.ant-table-container']

    for (const selector of potentialSelectors) {
      const candidate = tableContainerRef.current.querySelector<HTMLElement>(selector)
      if (candidate && candidate.scrollWidth > candidate.clientWidth) {
        scrollTargetRef.current = candidate
        return
      }
    }

    scrollTargetRef.current = tableContainerRef.current
  }, [columnsTable, transformedData])

  const handleScroll = (direction: 'left' | 'right') => {
    const target = scrollTargetRef.current ?? tableContainerRef.current
    if (!target) return

    const scrollAmount = 300
    const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount
    target.scrollBy({left: scrollLeft, behavior: 'smooth'})
  }

  const handleDeleteSubmit = async () => {
    try {
      // Proceed with server-side submission
      const response = await deleteRowApi({
        id: data?.id
      }).unwrap()
      message.success(deleteSuccessMessage)
      refetch()
      setShowDeleteModal(false)
    } catch (err: any) {
      // Handle server-side errors
      message.error(deleteErrorMessage)
      setShowDeleteModal(false)
    }
  }

  const handlePrint = () => {
    // Use exportColumns if provided, otherwise use columnsTable and filter out actions
    const columnsToUse =
      exportColumns.length > 0 ? exportColumns : columnsTable.filter((col: any) => col.dataIndex !== 'action')

    // Generate table HTML from data
    const generateTableHTML = () => {
      const headers = columnsToUse.map((col: any) => `<th>${col.title}</th>`).join('')
      console.log('🚀 ~ generateTableHTML ~ columnsToUse:', columnsToUse)

      const rows = transformedData
        .map((row: any, index: number) => {
          const cells = columnsToUse
            .map((col: any) => {
              // start with raw value
              let cellValue: any = row[col.dataIndex]

              // apply custom render fn if provided
              if (col.render) {
                const rendered = col.render(row[col.dataIndex], row, index)

                if (isValidElement(rendered as any)) {
                  cellValue = rendered.props.children ?? rendered.props.href ?? ''
                } else {
                  cellValue = rendered
                }
              }

              // Handle all object types more aggressively
              if (cellValue && typeof cellValue === 'object') {
                console.log(`🚀 Object detected:`, cellValue)
                // Try to extract meaningful value from objects
                if (cellValue.props && cellValue.props.children) {
                  cellValue = cellValue.props.children
                } else if (cellValue.props && cellValue.props.href) {
                  cellValue = cellValue.props.href
                } else if (Array.isArray(cellValue)) {
                  cellValue = cellValue.join(', ')
                } else {
                  // Last resort: use original raw value if available
                  cellValue =
                    row[col.dataIndex] && typeof row[col.dataIndex] !== 'object'
                      ? row[col.dataIndex]
                      : '[Complex Object]'
                }
              }

              // coerce to string and handle null/undefined
              const text = cellValue != null ? String(cellValue) : '-'
              console.log(`🚀 Final text:`, text)
              return `<td>${text}</td>`
            })
            .join('')

          return `<tr class="${index % 2 === 0 ? 'even-row' : ''}">${cells}</tr>`
        })
        .join('')

      return `
        <table>
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `
    }

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${printTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
              th { background-color: #000; color: white; font-weight: bold; }
              .even-row { background-color: #E8E8E8; }
              .print-title { text-align: center; margin-bottom: 20px; font-size: 24px; font-weight: bold; }
              @media print { 
                body { margin: 0; }
                .no-print { display: none; }
                table { font-size: 10px; }
                th, td { padding: 4px; }
              }
            </style>
          </head>
          <body>
            <div class="print-title">${printTitle}</div>
            ${generateTableHTML()}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
      printWindow.close()
    }
  }

  const handleExportExcel = () => {
    // Use exportColumns if provided, otherwise use columnsTable and filter out actions
    const columnsToUse =
      exportColumns.length > 0 ? exportColumns : columnsTable.filter((col: any) => col.dataIndex !== 'action')

    // Prepare data for Excel export
    const prepareDataForExcel = () => {
      const headers = columnsToUse.map((col: any) => col.title)

      const rows = transformedData.map((row: any, index: number) => {
        const rowData: any = {}

        columnsToUse.forEach((col: any) => {
          let cellValue: any = row[col.dataIndex]

          // Apply custom render function if exists
          if (col.render) {
            const rendered = col.render(row[col.dataIndex], row, index)
            if (isValidElement(rendered as any)) {
              cellValue = rendered.props.children ?? rendered.props.href ?? ''
            } else {
              cellValue = rendered
            }
          }

          // Handle objects
          if (cellValue && typeof cellValue === 'object') {
            if (cellValue.props && cellValue.props.children) {
              cellValue = cellValue.props.children
            } else if (cellValue.props && cellValue.props.href) {
              cellValue = cellValue.props.href
            } else if (Array.isArray(cellValue)) {
              cellValue = cellValue.join(', ')
            } else {
              cellValue = row[col.dataIndex] && typeof row[col.dataIndex] !== 'object' ? row[col.dataIndex] : ''
            }
          }

          rowData[col.title] = cellValue != null ? String(cellValue) : ''
        })

        return rowData
      })

      return rows
    }

    try {
      const data = prepareDataForExcel()
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Data')

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const filename = `${printTitle.replace(/\s+/g, '_')}_${timestamp}.xlsx`

      XLSX.writeFile(wb, filename)
      message.success('Excel file exported successfully!')
    } catch (error) {
      console.error('Export failed:', error)
      message.error('Failed to export Excel file')
    }
  }

  return (
    <div className="table-main-component-wrapper">
      {(showPrintButton || showExportButton) && (
        <div className="mb-4 flex justify-end gap-2 pt-4">
          {showPrintButton && (
            <Button type="default" icon={<PrinterOutlined />} onClick={handlePrint} className="no-print font-[500]">
              Print Table
            </Button>
          )}
          {showExportButton && (
            <Button
              type="default"
              icon={<FileExcelOutlined />}
              onClick={handleExportExcel}
              className="no-print font-[500]"
            >
              Export Excel
            </Button>
          )}
        </div>
      )}

      <div id="printable-table" className="relative">
        {/* Scroll Buttons */}
        {showScrollButtons && (
          <>
            <button
              onClick={() => handleScroll('left')}
              className="table-scroll-button table-scroll-button-left"
              title="Scroll left"
              aria-label="Scroll table left"
            >
              <Icon icon="heroicons:chevron-left" className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleScroll('right')}
              className="table-scroll-button table-scroll-button-right"
              title="Scroll right"
              aria-label="Scroll table right"
            >
              <Icon icon="heroicons:chevron-right" className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Table Container */}
        <div
          ref={tableContainerRef}
          className={`overflow-x-auto rounded-xl ${transparentRows ? 'table-main-component-transparent' : ''}`}
        >
          <div className="table-main-component">
            <Table<any>
              columns={columnsTable}
              dataSource={transformedData as any}
              onChange={() => {}}
              loading={isLoading}
              pagination={false}
              bordered={bordered}
              style={{
                backgroundColor: 'transparent'
              }}
              scroll={{x: 'max-content'}}
              rowClassName={(record, index) => {
                if (index === 0 && firstRowClassName) {
                  return firstRowClassName
                }
                return index % 2 === 0 ? secondRowClassName || 'bg-[#E8E8E8]' : ''
              }}
            />
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <PlannerModal
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          className='rounded-xl'
          width={450}
          onCloseModal={() => setShowDeleteModal(false)}
        >
          {DeleteModalComponent}
        </PlannerModal>
      )}
    </div>
  )
}

export default TableMainComponent
