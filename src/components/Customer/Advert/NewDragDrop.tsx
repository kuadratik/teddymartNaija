import {useMediaQuery} from '@/hooks/use-media-query'
import {Icon} from '@iconify/react'
import {Reorder} from 'framer-motion'
import React from 'react'
import FileThumbnail from './FileThumbnail'
import TextComponent from '@/components/SharedUI/TextComponent'
import Spinner from '@/components/SharedUI/Spinner'
import {
  useDeleteImageFileMutation,
  useUploadImageFileMutation,
  useUploadVideoFileMutation
} from '@/services/general/general'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import {twMerge} from 'tailwind-merge'
import {fileToBase64} from '@/components/Vendor/utils'

type IProps = {
  uploadedFiles: {file: string; id: string}[] | null
  setUploadedFiles: React.Dispatch<React.SetStateAction<{file: string; id: string}[] | null>>
  fileList: any[]
  setFileList: React.Dispatch<React.SetStateAction<any[]>>
}

const NewDragDrop = React.memo(({uploadedFiles, setUploadedFiles, fileList, setFileList}: IProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [uploadFile, {isLoading: isUploadLoading}] = useUploadImageFileMutation()
  const [uploadVideo, {isLoading: isUploadVideoLoading}] = useUploadVideoFileMutation()
  const [deleteFile, {isLoading: isDeleteFileLoading}] = useDeleteImageFileMutation()

  const [uploadedFile, setUploadedFile] = React.useState<string | null>(null)
  const [inputValue, setInputValue] = React.useState('')

  const stopsContainerRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = React.useState(false)

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

  // const compressMedia = (file: File): Promise<File> => {
  //   return new Promise((resolve, reject) => {
  //     // Check if the file is an image or video based on its MIME type
  //     const isImage = file.type.startsWith('image/')
  //     const isVideo = file.type.startsWith('video/')

  //     if (isImage) {
  //       // Image compression logic
  //       const reader = new FileReader()
  //       reader.readAsDataURL(file)

  //       reader.onload = (event: ProgressEvent<FileReader>) => {
  //         const img = document.createElement('img')
  //         img.src = event.target?.result as string

  //         img.onload = () => {
  //           const canvas = document.createElement('canvas')
  //           const width = img.width
  //           const height = img.height

  //           canvas.width = width
  //           canvas.height = height

  //           const ctx = canvas.getContext('2d')
  //           ctx?.drawImage(img, 0, 0, width, height)

  //           // Convert canvas to a compressed image blob
  //           canvas.toBlob(
  //             blob => {
  //               if (blob) {
  //                 const compressedFile = new File([blob], file.name, {
  //                   type: file.type,
  //                   lastModified: Date.now()
  //                 })
  //                 resolve(compressedFile)
  //               } else {
  //                 reject(new Error('Failed to compress image.'))
  //               }
  //             },
  //             file.type,
  //             0.8 // Compression quality for image (0.8 is medium quality)
  //           )
  //         }

  //         img.onerror = () => reject(new Error('Failed to load image.'))
  //       }

  //       reader.onerror = () => reject(new Error('Failed to read file.'))
  //     } else if (isVideo) {
  //       // Video compression logic
  //       const video = document.createElement('video')
  //       video.src = URL.createObjectURL(file)
  //       video.controls = true

  //       video.onloadedmetadata = () => {
  //         const canvas = document.createElement('canvas')
  //         canvas.width = video.videoWidth
  //         canvas.height = video.videoHeight

  //         const ctx = canvas.getContext('2d')
  //         video.play()

  //         video.onplay = () => {
  //           // Draw the first frame of the video on canvas
  //           ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

  //           // Convert canvas to a compressed video frame
  //           canvas.toBlob(
  //             blob => {
  //               if (blob) {
  //                 const compressedFile = new File([blob], file.name, {
  //                   type: 'video/webm',
  //                   lastModified: Date.now()
  //                 })
  //                 resolve(compressedFile)
  //               } else {
  //                 reject(new Error('Failed to compress video.'))
  //               }
  //             },
  //             'video/webm',
  //             0.7 // Compression quality for video (0.7 is medium quality)
  //           )

  //           video.pause()
  //         }
  //       }

  //       video.onerror = () => reject(new Error('Failed to load video.'))
  //     } else {
  //       reject(new Error('Unsupported file type. Only images and videos are supported.'))
  //     }
  //   })
  // }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      try {
        // Check if a video is already in fileList
        const videoExists = fileList.some(item => item.originalFile.type?.startsWith('video'))
        if (videoExists && file.type.startsWith('video')) {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>You can only upload one video per ad!</>}
                  image={errorToastIcon}
                  textColor="#fff"
                  message={
                    'You can only upload one video at a time. Please remove the existing video to upload another.'
                  }
                  backgroundColor="#000"
                />
              )
            },
            message: 'Oops, Something went wrong'
          })
          event.target.value = ''
          return
        }

        const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
        if (file.size > MAX_FILE_SIZE) {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>File too large! Must be less than 20MB</>}
                  image={errorToastIcon}
                  textColor="#fff"
                  message={'Please upload a file that is less than 20MB in size.'}
                  backgroundColor="#000"
                />
              )
            },
            message: 'Oops, Something went wrong'
          })
          event.target.value = ''
          return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
          const base64String = reader.result as string
          setUploadedFile(base64String)

          if (file?.type?.startsWith('video')) {
            const videoElement: any = videoRef.current

            if (videoElement) {
              videoElement.src = URL.createObjectURL(file as any)
              videoElement.onloadedmetadata = () => {
                if (videoElement.duration > 90) {
                  showPlannerToast({
                    options: {
                      customToast: (
                        <CustomToast
                          altText={''}
                          title={<>Video too long!</>}
                          image={errorToastIcon}
                          textColor="#fff"
                          message={'Please upload a video that is less than 1 minute, 30 seconds long.'}
                          backgroundColor="#000"
                        />
                      )
                    },
                    message: 'Oops, Something went wrong'
                  })
                  return
                } else {
                  // handleVideoUpload(info.file as UploadFile)
                }
              }
            }

            handleVideoUpload(file)
          } else {
            handleUpload(file)
          }
          //   setUploadedDetails(compressedFile)
          //   setError('')
        }
        reader.readAsDataURL(file)
      } catch (error) {
        // setError('Failed to compress image. Please try a smaller file.')
        event.target.value = ''
        setInputValue('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
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
        // Check if a video is already in fileList
        const videoExists = fileList.some(item => item.type?.startsWith('video'))
        if (videoExists && file.type.startsWith('video')) {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>Video already uploaded!</>}
                  image={errorToastIcon}
                  textColor="#fff"
                  message={
                    'You can only upload one video at a time. Please remove the existing video to upload another.'
                  }
                  backgroundColor="#000"
                />
              )
            },
            message: 'Oops, Something went wrong'
          })
          // event.dataTransfer.clearData()
          return
        }

        const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
        if (file.size > MAX_FILE_SIZE) {
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>File too large! Must be less than 20MB</>}
                  image={errorToastIcon}
                  textColor="#fff"
                  message={'Please upload a file that is less than 20MB in size.'}
                  backgroundColor="#000"
                />
              )
            },
            message: 'Oops, Something went wrong'
          })
          // event.dataTransfer.clearData()
          return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setUploadedFile(base64String)

          if (file?.type?.startsWith('video')) {
            const videoElement: any = videoRef.current

            if (videoElement) {
              videoElement.src = URL.createObjectURL(file as any)
              videoElement.onloadedmetadata = () => {
                if (videoElement.duration > 90) {
                  showPlannerToast({
                    options: {
                      customToast: (
                        <CustomToast
                          altText={''}
                          title={<>Video too long!</>}
                          image={errorToastIcon}
                          textColor="#fff"
                          message={'Please upload a video that is less than 1 minute, 30 seconds long.'}
                          backgroundColor="#000"
                        />
                      )
                    },
                    message: 'Oops, Something went wrong'
                  })
                  return
                } else {
                  // handleVideoUpload(info.file as UploadFile)
                }
              }
            }

            handleVideoUpload(file)
          } else {
            handleUpload(file)
          }
          //   setUploadedDetails(compressedFile)
          //   setError('')
        }
        reader.readAsDataURL(file)
      } catch (error) {
        // setError('Failed to compress image. Please try a smaller file.')
        setUploadedFile(null)
        setInputValue('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        // setFileInputKey(prevKey => prevKey + 1)
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
    // setUploadedDetails(null)
    setUploadedFile(null)
  }

  const handleDelete = (uid: string) => {
    setFileList(prev => {
      if (prev) {
        return prev.filter(f => f.uid !== uid)
      } else {
        return []
      }
    })
    setUploadedFiles(prev => {
      if (prev) {
        return prev?.filter(f => f.id !== uid)
      } else {
        return null
      }
    })
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
          setUploadedFiles(prev => {
            if (prev) {
              return [...prev, {file: data.data[0], id: String(prev.length + 1)}]
            } else {
              return [{file: data.data[0], id: '1'}]
            }
          })
          setFileList(prev => {
            if (prev) {
              return [...prev, {originalFile: compressedFile, uid: String(prev.length + 1)}]
            } else {
              return [{originalFile: compressedFile, uid: '1'}]
            }
          })
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

  const handleVideoUpload = async (compressedFile: any) => {
    const newFile = await fileToBase64(compressedFile as File)
    let payload = {
      videos: [newFile]
    }

    // console.log('payload', payload)

    try {
      const res = await uploadVideo({
        body: payload
      })
        .unwrap()
        .then(data => {
          setUploadedFiles(prev => {
            if (prev) {
              return [...prev, {file: data.data[0], id: String(prev.length + 1)}]
            } else {
              return [{file: data.data[0], id: '1'}]
            }
          })
          setFileList(prev => {
            if (prev) {
              return [...prev, {originalFile: compressedFile, uid: String(prev.length + 1)}]
            } else {
              return [{originalFile: compressedFile, uid: '1'}]
            }
          })
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

  const handleFileDelete = async (uid: string) => {
    let payload = {
      paths: [`teddymart/${uploadedFiles?.find(f => f.id === uid)?.file}` || '']
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

          handleDelete(uid)
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

  console.log('rerendering,', fileList)

  return (
    <div className="flex h-full w-full flex-col items-center gap-3 lg:flex-row lg:items-start" ref={stopsContainerRef}>
      <div
        className={twMerge(
          'flex h-[227px] w-full flex-shrink-0 rounded-lg border-2 border-dashed p-4 text-center text-sm text-[#3D3D3D] lg:w-[153px]',
          dragging ? 'border-blue-500' : 'border-[#E4E4E4]',
          ''
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-disabled={isUploadLoading || isUploadVideoLoading || fileList.length === 3}
        // onClick={() => document.getElementById('file-upload')?.click()}
      >
        {fileList.length < 3 && (
          <input
            accept={'.png, .jpeg, .jpg, .webp'}
            ref={fileInputRef}
            type="file"
            style={{
              display: 'none'
            }}
            value={inputValue}
            disabled={isUploadLoading || isUploadVideoLoading || fileList.length === 3}
            className="hidden"
            id={'file-upload'}
            onChange={handleFileUpload}
          />
        )}
        <div className="h-full w-full">
          <label
            htmlFor={fileList.length === 3 ? undefined : 'file-upload'}
            className="flex h-full w-full cursor-pointer items-center justify-center hover:underline"
          >
            <p className="ant-upload-drag-icon">
              <Icon icon={'ic:outline-plus'} className="mx-auto text-5xl text-custom_grey" />
            </p>
          </label>
        </div>
      </div>

      <Reorder.Group
        dragConstraints={stopsContainerRef}
        className={`grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:h-[227px] lg:grid-cols-3`}
        axis={isDesktop ? 'x' : 'y'}
        values={fileList || []}
        onReorder={newOrder => {
          setFileList(newOrder)
        }}
      >
        {fileList.map((file, index) => {
          // console.log('file', file)
          return (
            <Reorder.Item
              dragListener={true}
              key={file.uid}
              value={file}
              dragConstraints={stopsContainerRef}
              className=""
            >
              <div
                key={index}
                // onRemove={() => {
                //   setFileList(fileList.filter(f => f.uid !== file.uid))
                // }}
                className="h-full w-full overflow-hidden rounded-lg"
              >
                <FileThumbnail
                  file={file.originalFile as File}
                  onDelete={() => {
                    handleFileDelete(file.uid)
                  }}
                  deleteLoading={isDeleteFileLoading}
                />
                {index === 0 && (
                  <TextComponent as="span" className="text-[13px] leading-[16px] text-[#6B7280]">
                    This is your title media
                  </TextComponent>
                )}
              </div>
            </Reorder.Item>
          )
        })}
        {(isUploadLoading || isUploadVideoLoading) && (
          <div
            className="flex h-[227px] w-full items-center justify-center rounded-lg bg-plannerGrayColor bg-cover bg-center"
            style={{}}
          >
            {/* Optional video icon overlay or play button can be added here */}
            <Spinner className="text-[44px] text-white" />
          </div>
        )}
      </Reorder.Group>

      <video
        ref={videoRef}
        className="h-[227px] w-full flex-shrink-0 lg:w-[153px]"
        controls
        style={{display: 'none'}}
      />
    </div>
  )
})

export default NewDragDrop
