import Image from 'next/image'
import React, {useEffect, useRef, useState} from 'react'
import {twMerge} from 'tailwind-merge'

import dayjs from 'dayjs'
import {useDeleteImageFileMutation, useUploadImageFileMutation} from '@/services/general/general'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {fileToBase64} from '../utils'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import Spinner from '@/components/SharedUI/Spinner'

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
  heightLimit = 100,
  widthLimit = 100,
  externalError = false,
  text,
  editMode,
  disabled = false
}) => {
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
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
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
            // setUploadedFile(base64String) // This is the Base64 string
            // setUploadedDetails(file)
            handleUpload(file)
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

        if (width <= widthLimit && height <= heightLimit) {
          // Image dimensions are within the limit
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64String = reader.result as string
            // setUploadedFile(base64String) // This is the Base64 string
            // setUploadedDetails(file)
            handleUpload(file)
            setError('')
          }
          reader.readAsDataURL(file)
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
          // setUploadedFiles(prev => {
          //   if (prev) {
          //     return [...prev, {file: data.data[0], id: String(prev.length + 1)}]
          //   } else {
          //     return [{file: data.data[0], id: '1'}]
          //   }
          // })
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

  const handleFileDelete = async () => {
    let payload = {
      paths: [`teddymart/${uploadedFile}` || '']
    }

    // console.log('payload', payload)

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

          handleClearUpload()
        })
        .catch((err: any) => {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText={''}
                  title={<>{err?.data?.message || 'Error deleting file!'}</>}
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
              title={<>Failed to delete file!</>}
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
      try {
        const response = await fetch(`${process.env.imageBaseUrl}/${uploadFile}`, {method: 'HEAD'}) // Use HEAD to fetch headers only
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
  }, [uploadFile])

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
          'h-[188px] w-full cursor-pointer rounded-lg border-[1.5px] p-6 text-center text-sm text-[#3D3D3D] md:w-[272px]',
          dragging ? 'border-blue-500' : 'border-[#E4E4E4]',
          uploadedDetails ? '' : 'border-dashed',
          disabled ? 'cursor-not-allowed bg-opacity-30' : '',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        // onClick={() => document.getElementById('file-upload')?.click()}
      >
        {!disabled && editMode === false && (
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
        <Image
          src={uploadedDetails ? '/assets/admission/file_upload_states.svg' : '/assets/admission/Upload.svg'}
          width={48}
          height={48}
          alt="upload"
          className="mx-auto"
        />

        {uploadedDetails ? (
          <div>
            <p className="mb-2 font-semibold leading-[19.36px] text-[#3D3D3D]">Upload Successful</p>
            <span className="block">
              {uploadedDetails.name || uploadedFile?.split('/')[2]}{' '}
              <span className="text-[#828893]">| {(uploadedDetails.size / 1024).toFixed(0)} KB . </span>
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
        ) : editMode && uploadFile !== undefined ? (
          <div>
            <p className="mb-2 font-semibold leading-[19.36px] text-[#3D3D3D]">Upload Successful</p>
            <span className="block">
              {uploadedFile?.split('/')[2]}{' '}
              {fileSize ? <span className="text-[#828893]">| {fileSize} KB . </span> : null}
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
                {/* Optional video icon overlay or play button can be added here */}
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
