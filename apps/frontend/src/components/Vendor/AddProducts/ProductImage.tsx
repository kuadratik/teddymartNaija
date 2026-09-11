import Image from 'next/image'
import React, {useEffect, useRef, useState} from 'react'
import {twMerge} from 'tailwind-merge'

import Spinner from '@/components/SharedUI/Spinner'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {useDeleteImageFileMutation, useUploadImageFileMutation} from '@/services/general/general'
import {compressImage} from '@/utils/imageCompression'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import {fileToBase64} from '../utils'

interface IProps {
  placeholder?: string
  uploadedDetails: File | null
  setUploadedDetails: (file: File | null) => void
  className?: string
  uploadedFile: string | null
  setUploadedFile: (file: string) => void
  title?: React.ReactNode
  accept?: string
  id?: string
  errorText: string
  heightLimit?: number
  widthLimit?: number
  externalError?: boolean
  text?: string
  editMode?: boolean
  disabled?: boolean
}

const ProductIImageFile: React.FC<IProps> = ({
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
  text,
  editMode,
  disabled = false
}) => {
  console.log('🚀 ~ uploadedFile:', uploadedFile)
  const [uploadFile, {isLoading: isUploadLoading}] = useUploadImageFileMutation()
  const [deleteFile, {isLoading: isDeleteFileLoading}] = useDeleteImageFileMutation()
  const [dragging, setDragging] = useState(false)

  const [fileInputKey, setFileInputKey] = useState(0)

  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const handleDivClick = (e: {stopPropagation: () => void}) => {
    e.stopPropagation()

    if (fileInputRef.current) {
      fileInputRef.current.click() // Trigger click on hidden file input
    }
  }
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]

      // Create an Image object without arguments
      const img = new window.Image() // Using window.Image() to avoid TypeScript errors
      img.src = URL.createObjectURL(file)
      img.onload = async () => {
        const {width, height} = img
        if (width <= widthLimit && height <= heightLimit) {
          // If image dimensions are within the limit, proceed with compression and upload
          try {
            // Use higher quality settings and smart compression
            const compressedFile = await compressImage(file, 1200, 1200, 0.92, true, true)
            handleUpload(compressedFile)
            setError('')
          } catch (err) {
            console.error('Image compression failed:', err)
            // Fallback to original file if compression fails
            handleUpload(file)
            setError('')
          }
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

      img.onload = async () => {
        const {width, height} = img

        if (width <= widthLimit && height <= heightLimit) {
          // Image dimensions are within the limit, compress then upload
          try {
            // Use higher quality settings and smart compression
            const compressedFile = await compressImage(file, 1200, 1200, 0.92, true, true)
            handleUpload(compressedFile)
            setError('')
          } catch (err) {
            console.error('Image compression failed:', err)
            // Fallback to original file if compression fails
            handleUpload(file)
            setError('')
          }
        } else {
          // Handle image size exceeding the limit
          setError(errorText)
          setUploadedFile('') // Clear any previous files
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          setFileInputKey(prevKey => prevKey + 1)
        }

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(img.src)
      }

      img.onerror = () => {
        setUploadedFile('') // Clear any previous files
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

  const handleClearUpload = () => {
    setUploadedDetails(null)
    setUploadedFile('')
  }

  const handleFileDelete = async () => {
    let payload = {
      paths: [`teddymart/${uploadedFile}` || '']
    }

    // Always clear the frontend state first to ensure responsive UI
    handleClearUpload()

    try {
      const res = await deleteFile({
        body: payload
      })
        .unwrap()
        .then(data => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{data?.message || 'File deleted successfully!'}</>}
                  textColor="#FFF"
                  message={data?.message}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
          // No need to call handleClearUpload() again as it's already done above
        })
        .catch((err: any) => {
          // Show error toast but don't revert frontend state
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>File might not be removed from server</>}
                  textColor="#FFF"
                  message={
                    err?.data?.message || 'The file was removed from your view but may still exist on the server.'
                  }
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
    } catch (error: any) {
      // Show error toast but don't revert frontend state
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Warning: File might not be removed from server</>}
              image={errorToastIcon}
              textColor="#fff"
              message="The file was removed from your view but may still exist on the server."
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  const handleUpload = async (compressedFile: any) => {
    const newFile = await fileToBase64(compressedFile as File)
    let payload = {
      images: [newFile]
    }

    try {
      const res = await uploadFile({
        body: payload
      })
        .unwrap()
        .then(data => {
          // Instead of appending to an array, we directly set the file for this specific position
          setUploadedDetails(compressedFile)
          setUploadedFile(data.data[0])
        })
        .catch((err: any) => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{err?.data?.message || 'Error uploading image!'}</>}
                  textColor="#FFF"
                  message={err?.data?.message}
                  backgroundColor="#000"
                />
              )
            },
            message: 'message'
          })
        })
    } catch (error: any) {
      showPlannerToast({
        options: {
          customToast: (
            <CustomToast
              altText={''}
              title={<>Failed to upload file!</>}
              image={errorToastIcon}
              textColor="#fff"
              message={(error as any)?.data?.message || 'Please check and try again.'}
              backgroundColor="#000"
            />
          )
        },
        message: 'Oops, Something went wrong'
      })
    }
  }

  const [fileSize, setFileSize] = useState<string | null>(null)
  // const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFileSize = async () => {
      if (!uploadedFile) return // Add this check to prevent unnecessary fetches

      try {
        const response = await fetch(`${process.env.imageBaseUrl}/${uploadedFile}`, {method: 'HEAD'}) // Use HEAD to fetch headers only
        if (response.ok) {
          const size = response.headers.get('Content-Length')
          if (size) {
            setFileSize((Number(size) / 1024).toFixed(2)) // Convert bytes to KB and format to 2 decimals
          } else {
            // setError('Unable to determine file size.')
            setFileSize(null)
          }
        } else {
          // setError(`Error fetching file: ${response.statusText}`)
          setFileSize(null)
        }
      } catch (err) {
        // setError('Failed to fetch file size.')
        setFileSize(null)
      }
    }

    fetchFileSize()
  }, [uploadedFile])

  return (
    <div className="mb-4">
      {!title || title === '' ? null : (
        <div className={`mb-[8px]`}>
          <label className={twMerge('text-sm capitalize text-[#6B7280]')}>{title}</label>
        </div>
      )}

      <div
        onClick={handleDivClick}
        className={twMerge(
          'relative h-[188px] w-full cursor-pointer overflow-hidden rounded-lg border-[1.5px] p-6 text-center text-sm text-[#3D3D3D] md:w-[272px]',
          dragging ? 'border-blue-500' : 'border-[#E4E4E4]',
          uploadedDetails ? '' : 'border-dashed',
          disabled ? 'cursor-not-allowed bg-opacity-30' : '',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedDetails && (
          <div className="absolute inset-0 z-0">
            <img
              src={URL.createObjectURL(uploadedDetails)}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}

        {editMode && uploadedFile && !uploadedDetails && (
          <div className="absolute inset-0 z-0">
            <img
              src={`${process.env.imageBaseUrl}/${uploadedFile}`}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}

        {!disabled && (
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
        )}

        {/* Conditionally render the upload icon only when no image is present */}
        {!(uploadedDetails || (editMode && uploadedFile)) && (
          <Image src="/assets/admission/Upload.svg" width={48} height={48} alt="upload" className="mx-auto" />
        )}

        {uploadedDetails ? (
          <div className="relative z-10">
            <p className="mb-2 font-semibold leading-[19.36px] text-white">Upload Successful</p>
            <span className="block text-white">
              {uploadedDetails.name || uploadedFile?.split('/')[2]}{' '}
              <span className="text-gray-200">| {(uploadedDetails.size / 1024).toFixed(0)} KB . </span>
            </span>
            <div
              className="mx-auto mt-2 flex w-[160px] cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#F7E4E7] py-2 text-[#FF4159]"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation()
                handleFileDelete()
              }}
            >
              {isDeleteFileLoading ? (
                <Spinner className="border-[#FF4159] text-[16px]" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Image src={'/assets/admission/bin.svg'} width={16} height={16} alt="delete icon" />
                  <span className="text-xm font-semibold">Clear Upload</span>
                </div>
              )}
            </div>
          </div>
        ) : editMode && uploadedFile ? (
          <div className="relative z-10">
            <p className="mb-2 font-semibold leading-[19.36px] text-white">Upload Successful</p>
            <span className="block text-white">
              {uploadedFile?.split('/')[2]}{' '}
              {fileSize ? <span className="text-gray-200">| {fileSize} KB . </span> : null}
            </span>
            <div
              className="mx-auto mt-2 flex w-[160px] cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#F7E4E7] py-2 text-[#FF4159]"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation()
                handleFileDelete()
              }}
            >
              {isDeleteFileLoading ? (
                <Spinner className="border-[#FF4159] text-[16px]" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Image src={'/assets/admission/bin.svg'} width={16} height={16} alt="delete icon" />
                  <span className="text-xm font-semibold">Clear Upload</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="">
            <label className="cursor-pointer hover:underline">
              <span className="font-bold text-[#030304]">{text ?? 'Click to Upload'}</span>
              <span className="text-[#3D3D3D]"> or drag and drop</span>
            </label>
            <p className="text-[12px] text-[#828893]">{placeholder}</p>

            {isUploadLoading && (
              <div
                className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center rounded-lg bg-plannerGrayColor bg-cover bg-center"
                style={{}}
              >
                <Spinner className="text-[44px] text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">{error}</p>}
      {externalError && <p className="mt-[10px] flex flex-col gap-1 text-xs text-[#FF4A4A]">{errorText}</p>}
    </div>
  )
}

export default ProductIImageFile
