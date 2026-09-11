import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import dayjs from 'dayjs'

interface IProps {
  placeholder?: string
  uploadedDetails: File | null
  setUploadedDetails: (file: File | null) => void
  className?: string
  uploadedFile: string | null
  setUploadedFile: (file: string | null) => void
  title?: React.ReactNode
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
  heightLimit = 500,
  widthLimit = 500,
  externalError = false,
  text
}) => {
  const [dragging, setDragging] = useState(false)

  const [fileInputKey, setFileInputKey] = useState(0)

  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const compressImage = (file: File, maxWidth: number, maxHeight: number, maxSizeMB: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = document.createElement('img')
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            blob => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                })

                if (compressedFile.size > maxSizeMB * 1024 * 1024) {
                  reject(new Error('Compressed image still exceeds maximum file size.'))
                } else {
                  resolve(compressedFile)
                }
              } else {
                reject(new Error('Failed to compress image.'))
              }
            },
            file.type,
            0.9
          )
        }
        img.onerror = () => reject(new Error('Failed to load image.'))
      }
      reader.onerror = () => reject(new Error('Failed to read file.'))
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      try {
        const compressedFile = await compressImage(file, widthLimit, heightLimit, 4)
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setUploadedFile(base64String)
          setUploadedDetails(compressedFile)
          setError('')
        }
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        setError('Failed to compress image. Please try a smaller file.')
        event.target.value = ''
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setFileInputKey(prevKey => prevKey + 1)
      }
    }
  }
  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]
      event.dataTransfer.clearData()

      try {
        const compressedFile = await compressImage(file, widthLimit, heightLimit, 4)
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setUploadedFile(base64String)
          setUploadedDetails(compressedFile)
          setError('')
        }
        reader.readAsDataURL(compressedFile)
      } catch (error) {
        setError('Failed to compress image. Please try a smaller file.')
        setUploadedFile(null)
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
          dragging ? 'border-blue-500' : externalError || error ? 'border-red-500' : 'border-[#E4E4E4]',
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
