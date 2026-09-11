import Spinner from '@/components/SharedUI/Spinner'
import TextComponent from '@/components/SharedUI/TextComponent'
import CustomToast from '@/components/SharedUI/Toast/CustomToast'
import {showPlannerToast} from '@/components/SharedUI/Toast/plannerToast'
import {fileToBase64} from '@/components/Vendor/utils'
import {useMediaQuery} from '@/hooks/use-media-query'
import {
  useDeleteImageFileMutation,
  useUploadImageFileMutation,
  useUploadVideoFileMutation
} from '@/services/general/general'
import {Icon} from '@iconify/react'
import {Reorder} from 'framer-motion'
import React, {useEffect} from 'react'
import {twMerge} from 'tailwind-merge'
import errorToastIcon from '../../../../public/assets/error-toast-icon.svg'
import FileThumbnail from './FileThumbnail'
import { compressImage } from '@/utils/imageCompression'

type IProps = {
  uploadedFiles: {file: string; id: string}[] | null | any
  setUploadedFiles: React.Dispatch<React.SetStateAction<{file: string; id: string}[] | null>>
  fileList: any[]
  setFileList: React.Dispatch<React.SetStateAction<any[]>>
  adsInfo?: any
  dragListener?: boolean
}

const NewDragDrop = React.memo(
  ({uploadedFiles, setUploadedFiles, fileList, setFileList, adsInfo, dragListener = true}: IProps) => {
    console.log('fileList', uploadedFiles, fileList)
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

    useEffect(() => {
      if (adsInfo?.data.media) {
        // Use a Set to store unique media items based on file_path
        const uniqueMedia = Array.from(new Set(adsInfo.data.media.map((item: any) => item.file_path))).map(filePath => {
          return adsInfo.data.media.find((item: any) => item.file_path === filePath)
        })

        const transformedFileList = uniqueMedia.map((media, index) => {
          const fileName = media.file_path.split('/').pop() || 'temp/uploads/'
          const file = new File([new Blob()], fileName, {
            type: `image/${fileName.split('.').pop()?.toLowerCase()}`,
            lastModified: new Date(media.updated_at).getTime()
          })
          return {
            originalFile: file,
            uid: (index + 1).toString()
          }
        })

        const transformedUploadedFiles = uniqueMedia.map((media, index) => ({
          file: media.file_path.replace('teddymart/advert/media/', 'advert/media/'),
          type: media.type,
          id: (index + 1).toString()
        }))

        setFileList(transformedFileList)
        setUploadedFiles(transformedUploadedFiles)
      }
    }, [adsInfo])

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0]
        try {
          // Log original file size
          console.log('Original File Size:', (file.size / (1024 * 1024)).toFixed(2), 'MB')

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

          // Check file size
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

          // Handle image files
          if (file.type.startsWith('image')) {
            try {
              // Use the enhanced compressor with WebP conversion for better compression
              const compressedImage = await compressImage(
                file, // original file
                1200, // max width
                1200, // max height
                0.92, // quality (92%)
                true, // convert to WebP for better compression
                true // use smart compression
              )
              console.log('Compressed Image Size:', (compressedImage.size / (1024 * 1024)).toFixed(2), 'MB')
              console.log('Size Reduction:', (((file.size - compressedImage.size) / file.size) * 100).toFixed(2), '%')

              const reader = new FileReader()
              reader.onloadend = () => {
                const base64String = reader.result as string
                setUploadedFile(base64String)
                handleUpload(compressedImage)
              }
              reader.readAsDataURL(compressedImage)
            } catch (error) {
              throw new Error('Image compression failed')
            }
          }
          // Handle video files
          else if (file.type.startsWith('video')) {
            const videoElement: any = videoRef.current
            if (videoElement) {
              videoElement.src = URL.createObjectURL(file)
              videoElement.onloadedmetadata = async () => {
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
                }

                try {
                  const compressedVideo = await compressVideo(file)
                  console.log('Compressed Video Size:', (compressedVideo.size / (1024 * 1024)).toFixed(2), 'MB')
                  console.log(
                    'Size Reduction:',
                    (((file.size - compressedVideo.size) / file.size) * 100).toFixed(2),
                    '%'
                  )

                  const reader = new FileReader()
                  reader.onloadend = () => {
                    const base64String = reader.result as string
                    setUploadedFile(base64String)
                    handleVideoUpload(compressedVideo)
                  }
                  reader.readAsDataURL(compressedVideo)
                } catch (error) {
                  throw new Error('Video compression failed')
                }
              }
            }
          }
        } catch (error) {
          console.error('File processing failed:', error)
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>Processing Failed</>}
                  image={errorToastIcon}
                  textColor="#fff"
                  message={'Failed to process file. Please try again.'}
                  backgroundColor="#000"
                />
              )
            },
            message: 'Oops, Something went wrong'
          })
          event.target.value = ''
          setInputValue('')
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        }
      }
    }


    // Video compression helper function with size logging
    const compressVideo = async (file: File): Promise<File> => {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.src = URL.createObjectURL(file)

        video.onloadedmetadata = async () => {
          console.log('Original Video Duration:', video.duration.toFixed(2), 'seconds')

          try {
            const stream = (video as any).captureStream()
            const mediaRecorder = new MediaRecorder(stream, {
              mimeType: 'video/webm',
              videoBitsPerSecond: 1000000 // 1 Mbps
            })

            const chunks: Blob[] = []

            mediaRecorder.ondataavailable = e => {
              chunks.push(e.data)
            }

            mediaRecorder.onstop = () => {
              const blob = new Blob(chunks, {type: 'video/webm'})
              console.log('Compressed Video Blob Size:', (blob.size / (1024 * 1024)).toFixed(2), 'MB')

              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webm'), {
                type: 'video/webm',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            }

            mediaRecorder.start()
            video.play()

            setTimeout(() => {
              mediaRecorder.stop()
              video.pause()
              URL.revokeObjectURL(video.src)
            }, video.duration * 1000)
          } catch (error) {
            console.error('Video compression error:', error)
            reject(error)
          }
        }

        video.onerror = () => {
          reject(new Error('Failed to load video'))
        }
      })
    }

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setDragging(false)

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0]
        event.dataTransfer.clearData()

        try {
          // Log original file size
          console.log('Original File Size:', (file.size / (1024 * 1024)).toFixed(2), 'MB')

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
            return
          }

          const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20 MB
          if (file.size > MAX_FILE_SIZE) {
            showPlannerToast({
              options: {
                customToast: (
                  <CustomToast
                    altText=""
                    title={<>File too large! Must be less than 50MB</>}
                    image={errorToastIcon}
                    textColor="#fff"
                    message={'Please upload a file that is less than 20MB in size.'}
                    backgroundColor="#000"
                  />
                )
              },
              message: 'Oops, Something went wrong'
            })
            return
          }

          // Handle image files
          if (file.type.startsWith('image')) {
            try {
              // Use the enhanced compressor with WebP conversion for better compression
              const compressedImage = await compressImage(
                file, // original file
                1200, // max width
                1200, // max height
                0.92, // quality (92%)
                true, // convert to WebP for better compression
                true // use smart compression
              )
              console.log('Compressed Image Size:', (compressedImage.size / (1024 * 1024)).toFixed(2), 'MB')
              console.log('Size Reduction:', (((file.size - compressedImage.size) / file.size) * 100).toFixed(2), '%')

              const reader = new FileReader()
              reader.onloadend = () => {
                const base64String = reader.result as string
                setUploadedFile(base64String)
                handleUpload(compressedImage)
              }
              reader.readAsDataURL(compressedImage)
            } catch (error) {
              throw new Error('Image compression failed')
            }
          }
          // Handle video files
          else if (file.type.startsWith('video')) {
            const videoElement: any = videoRef.current
            if (videoElement) {
              videoElement.src = URL.createObjectURL(file)
              videoElement.onloadedmetadata = async () => {
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
                }

                try {
                  const compressedVideo = await compressVideo(file)
                  console.log('Compressed Video Size:', (compressedVideo.size / (1024 * 1024)).toFixed(2), 'MB')
                  console.log(
                    'Size Reduction:',
                    (((file.size - compressedVideo.size) / file.size) * 100).toFixed(2),
                    '%'
                  )

                  const reader = new FileReader()
                  reader.onloadend = () => {
                    const base64String = reader.result as string
                    setUploadedFile(base64String)
                    handleVideoUpload(compressedVideo)
                  }
                  reader.readAsDataURL(compressedVideo)
                } catch (error) {
                  throw new Error('Video compression failed')
                }
              }
            }
          } else {
            // Handle other file types without compression
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64String = reader.result as string
              setUploadedFile(base64String)
              handleUpload(file)
            }
            reader.readAsDataURL(file)
          }
        } catch (error) {
          console.error('File processing failed:', error)
          showPlannerToast({
            options: {
              customToast: (
                <CustomToast
                  altText=""
                  title={<>Processing Failed</>}
                  image={errorToastIcon}
                  textColor="#fff"
                  message={'Failed to process file. Please try again.'}
                  backgroundColor="#000"
                />
              )
            },
            message: 'Oops, Something went wrong'
          })
          setUploadedFile(null)
          setInputValue('')
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
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
      // Remove from fileList - using uid to filter
      const updatedFileList = fileList.filter(file => file.uid !== uid)

      // Remove from uploadedFiles - using id to filter
      const updatedUploadedFiles = uploadedFiles?.filter((file: any) => file.id !== uid)
      console.log('🚀 ~ handleFileDelete ~ updatedUploadedFiles:', updatedUploadedFiles)

      // Update both states
      setFileList(updatedFileList)
      setUploadedFiles(updatedUploadedFiles)
      let payload = {
        paths: [`teddymart/${uploadedFiles?.find((f: any) => f.id === uid)?.file}` || '']
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
      <div
        className="flex h-full w-full flex-col items-center gap-3 lg:flex-row lg:items-start"
        ref={stopsContainerRef}
      >
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
              accept={'.png, .jpeg, .jpg, .webp, ' + '.mp4, .webm, .mov, .avi, .mkv, .flv, .wmv, .m4v'}
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
            // Update fileList order
            setFileList(newOrder)

            // Create a map of original files using uid as key
            const fileMap = new Map(uploadedFiles.map((file: any) => [file.id, file]))

            // Map the new order while preserving original file data
            const newUploadedFiles = newOrder.map(file => {
              // Use the original uploaded file data based on uid
              return (
                fileMap.get(file.uid) || {
                  file: `temp/uploads/${file.uid}.jpeg`,
                  id: file.uid
                }
              )
            })

            // Update uploaded files state
            setUploadedFiles(newUploadedFiles as any)
          }}
        >
          {fileList.map((file, index) => {
            // console.log('file', file)
            return (
              <Reorder.Item
                dragListener={dragListener}
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
                    adsInfo={adsInfo}
                    file={file.originalFile as File}
                    onDelete={() => {
                      handleFileDelete(file.uid)
                    }}
                    deleteLoading={isDeleteFileLoading}
                    uploadedFiles={uploadedFiles?.[index]}
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
          muted
          controlsList="nodownload"
          className="h-[227px] w-full flex-shrink-0 lg:w-[153px]"
          controls
          style={{display: 'none'}}
        />
      </div>
    )
  }
)

export default NewDragDrop
