import Image from 'next/image'
import React, {useState} from 'react'
import {twMerge} from 'tailwind-merge'
import uploadIcon from '../../public/assets/admission/Upload.svg'
import deleteIcon from '../../public/assets/admission/bin.svg'
import uploadState from '../../public/assets/admission/file_upload_states.svg'

import dayjs from 'dayjs'

interface IProps {
  uploadedDetails: File | null
  setUploadedDetails: (file: File | null) => void
  className?: string
  uploadedFile: string | null
  setUploadedFile: (file: string | null) => void
}

const DragDropFile: React.FC<IProps> = ({
  uploadedDetails,
  setUploadedDetails,
  className,
  setUploadedFile,
  uploadedFile
}) => {
  const [dragging, setDragging] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      setUploadedDetails(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setUploadedFile(base64String) // This is the Base64 string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]
      setUploadedDetails(file)
      event.dataTransfer.clearData()

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setUploadedFile(base64String) // This is the Base64 string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!dragging) {
      setDragging(true)
    }
  }

  const handleDragLeave = () => {
    setDragging(false)
  }

  const handleClearUpload = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setUploadedDetails(null)
    setUploadedFile(null)
  }

  return (
    <div className="mb-4">
      <div
        className={twMerge(
          'rounded-lg border border-dashed p-4 text-center text-sm text-[#3D3D3D]',
          dragging ? 'border-blue-500' : 'border-[#E4E4E4]',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        // onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input type="file" className="hidden" id="file-upload" onChange={handleFileUpload} />
        <Image src={uploadedDetails ? uploadState : uploadIcon} width={48} alt="upload" className="mx-auto mb-4" />

        {uploadedDetails ? (
          <div>
            <p className="mb-2 font-semibold leading-[19.36px] text-[#3D3D3D]">Upload Successful</p>
            <span className="block">
              {uploadedDetails.name}{' '}
              <span className="text-[#828893]">
                | {(uploadedDetails.size / 1024).toFixed(0)} KB .{' '}
                {dayjs(uploadedDetails?.lastModified).format('DD MMM, YYYY')}
              </span>
            </span>
            <div
              className="mx-auto mt-2 flex w-[160px] cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#F7E4E7] py-2 text-[#FF4159]"
              onClick={handleClearUpload}
            >
              <Image src={deleteIcon} width={16} height={16} alt="delete icon" />
              <span className="text-xm font-semibold">Clear Upload</span>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="file-upload" className="cursor-pointer hover:underline">
              <span className="font-bold text-[#33357D]">Upload proof</span> or drag and drop
            </label>
            <p className="text-xs text-[#828893]">PDF, PNG, JPG or GIF (max. 800×400px)</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DragDropFile
