import Image from 'next/image'
import React, {useRef, useState} from 'react'
import {twMerge} from 'tailwind-merge'

import dayjs from 'dayjs'

interface IProps {
  placeholder?: string
  uploadedDetails: File | null
  setUploadedDetails: (file: File | null) => void
  className?: string
  uploadedFile: string | null
  setUploadedFile: (file: string | null) => void
  title?: string
  accept?: string
  id?: string
  errorText: string
  heightLimit?: number
  widthLimit?: number
  externalError?: boolean
  text?: string
}

const DragDropFile: React.FC<IProps> = ({
  uploadedDetails,
  setUploadedDetails,
  className,
  setUploadedFile,
  uploadedFile,
  placeholder,
  title,
  accept,
  id,
  errorText,
  heightLimit = 100,
  widthLimit = 100,
  externalError = false,
  text
}) => {
  const [dragging, setDragging] = useState(false)

  const [fileInputKey, setFileInputKey] = useState(0)

  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]

      // Create an Image object without arguments
      const img = new window.Image() // Using window.Image() to avoid TypeScript errors
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const {width, height} = img
        if (width <= widthLimit && height <= heightLimit) {
          // If image dimensions are within the limit, proceed with the upload process
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            setUploadedFile(base64String) // This is the Base64 string
            setUploadedDetails(file)
            setError('')
          }
          reader.readAsDataURL(file)
        } else {
          setError(errorText)
          // Optionally, reset the input value if the image is too large
          event.target.value = ''
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          setFileInputKey(prevKey => prevKey + 1)
        }

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(img.src)
      }

      img.onerror = () => {
        // Optionally, reset the input value
        event.target.value = ''
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setFileInputKey(prevKey => prevKey + 1)
      }
      event.target.value = ''
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]

      event.dataTransfer.clearData()

      const img = new window.Image() // Using window.Image() to avoid TypeScript errors
      img.src = URL.createObjectURL(file)

      img.onload = () => {
        const {width, height} = img

        if (width <= 100 && height <= 100) {
          // Image dimensions are within the limit
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            setUploadedFile(base64String) // This is the Base64 string
            setUploadedDetails(file)
            setError('')
          }
          reader.readAsDataURL(file)
        } else {
          // Handle image size exceeding the limit
          setError(errorText)
          setUploadedFile(null) // Clear any previous files
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          setFileInputKey(prevKey => prevKey + 1)
        }

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(img.src)
      }

      img.onerror = () => {
        setUploadedFile(null) // Clear any previous files
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setFileInputKey(prevKey => prevKey + 1)
      }
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
      {!title || title === '' ? null : (
        <div className={`mb-[14px]`}>
          <label className={twMerge('text-sm capitalize text-[#6B7280]')}>{title}</label>
        </div>
      )}

      <div
        className={twMerge(
          'rounded-lg border-2 border-dashed p-4 text-center text-sm text-[#3D3D3D]',
          dragging ? 'border-blue-500' : 'border-[#E4E4E4]',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        // onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          accept={accept}
          ref={fileInputRef}
          type="file"
          style={{
            display: 'none'
          }}
          className="hidden"
          id={id}
          onChange={handleFileUpload}
        />
        <Image
          src={uploadedDetails ? '/assets/admission/file_upload_states.svg' : '/assets/admission/Upload.svg'}
          width={48}
          height={48}
          alt="upload"
          className="mx-auto mb-4"
        />

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
              <Image src={'/assets/admission/bin.svg'} width={16} height={16} alt="delete icon" />
              <span className="text-xm font-semibold">Clear Upload</span>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor={id} className="cursor-pointer hover:underline">
              <span className="font-bold text-[#030304]">{text ?? 'Upload Picture'}</span>
              <span className="text-[#3D3D3D]"> or drag and drop</span>
            </label>
            <p className="text-xs text-[#828893]">{placeholder}</p>
          </div>
        )}
      </div>

      {error && <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">{error}</p>}
      {externalError && <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">{errorText}</p>}
    </div>
  )
}

export default DragDropFile
