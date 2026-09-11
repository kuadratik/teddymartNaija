import React, {isValidElement} from 'react'

import {FileExcelOutlined, PrinterOutlined} from '@ant-design/icons'
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
  DeleteModalComponent
}: IProps) => {
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
    <div>
      {(showPrintButton || showExportButton) && (
        <div className="mb-4 flex justify-end gap-2">
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
      <div id="printable-table">
        <Table<any>
          columns={columnsTable}
          dataSource={transformedData as any}
          onChange={() => {}}
          loading={isLoading}
          pagination={false}
          bordered={bordered}
          className="overflow-x-auto"
          scroll={{x: 'max-content'}}
          rowClassName={(record, index) => {
            if (index === 0) {
              return firstRowClassName || ''
            }
            return index % 2 === 0 ? secondRowClassName || 'bg-[#E8E8E8]' : ''
          }}
        />
      </div>
      {showDeleteModal && (
        <PlannerModal
          modalOpen={showDeleteModal}
          setModalOpen={setShowDeleteModal}
          onCloseModal={() => setShowDeleteModal(false)}
        >
          {DeleteModalComponent}
        </PlannerModal>
      )}
    </div>
  )
}

export default TableMainComponent
