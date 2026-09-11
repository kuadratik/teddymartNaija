import Spinner from '@/components/SharedUI/Spinner'
import VideoView from '@/components/SharedUI/VideoView'
import {useMediaQuery} from '@/hooks/use-media-query'
import {Icon} from '@iconify/react'
import React, {useState} from 'react'

interface FileThumbnailProps {
  file: File
  onDelete: () => void
  deleteLoading: boolean
  adsInfo: any
  uploadedFiles: any
}

interface DeleteButtonProps {
  onDelete: () => void
  deleteLoading: boolean
  currentlyDeleting: boolean
  setCurrentlyDeleting: React.Dispatch<React.SetStateAction<boolean>>
}

const DeleteButton = ({onDelete, deleteLoading, currentlyDeleting, setCurrentlyDeleting}: DeleteButtonProps) => (
  <button
    onClick={() => {
      if (deleteLoading === false) {
        setCurrentlyDeleting(true)
        onDelete()
      }
    }}
    className="rounded-[3px] bg-white p-1 hover:bg-white"
  >
    {deleteLoading && currentlyDeleting ? (
      <Spinner className="text-[10px] text-red-600" />
    ) : (
      <Icon icon="mdi:trash" className="text-[18px] text-red-600 lg:text-[14px]" />
    )}
  </button>
)

const FileThumbnail: React.FC<FileThumbnailProps> = ({
  file,
  onDelete,
  deleteLoading,
  adsInfo,
  uploadedFiles,
}) => {
  console.log('🚀 ~ uploadedFiles:', uploadedFiles)

  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [isHovered, setIsHovered] = useState(false)
  const [currentlyDeleting, setCurrentlyDeleting] = useState(false)
  const isFileImage = file?.type?.startsWith('image/')
  const isFileVideo = file?.type?.startsWith('video/')

  const getSourceUrl = (item?: Media | null) => {
    console.log('🚀 ~ getSourceUrl ~ item:', item)
    if (file?.size > 0) {
      return URL.createObjectURL(file)
    }
    return item ? `${process.env.imageBaseUrl}/teddymart/${item.file}` : ''
  }

  return (
    <div
      className="relative h-[227px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full w-full overflow-hidden rounded-lg">
        {file?.size > 0 ? (
          isFileImage ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              onError={(error: any) => {
                error.currentTarget.src = '/assets/default_banner.jpg'
              }}
              className="h-full w-full object-cover"
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
            />
          ) : isFileVideo ? (
            <VideoView
              className="h-full w-full"
              src={URL.createObjectURL(file)}
              width="270"
              height="50"
              visibilityOnly={true}
            />
          ) : (
            <p>Unsupported file type</p>
          )
        ) : uploadedFiles ? (
          // Just show the first media item if no file is provided
          uploadedFiles.type === 'image' ? (
            <img
              src={getSourceUrl(uploadedFiles)}
              onError={(error: any) => {
                error.currentTarget.src = '/assets/default_banner.jpg'
              }}
              alt={`Preview ${uploadedFiles.id}`}
              className="h-full w-full object-cover"
            />
          ) : uploadedFiles.type === 'video' ? (
            <VideoView
              className="h-full w-full"
              src={getSourceUrl(uploadedFiles)}
              width="270"
              height="50"
              visibilityOnly={true}
            />
          ) : null
        ) : (
          <p>No media available</p>
        )}
      </div>

      {/* Delete button */}
      {isDesktop && isHovered ? (
        <div className="absolute inset-0 flex cursor-pointer items-start justify-end bg-black bg-opacity-50 px-[6px] py-1">
          <DeleteButton
            deleteLoading={deleteLoading}
            onDelete={onDelete}
            currentlyDeleting={currentlyDeleting}
            setCurrentlyDeleting={setCurrentlyDeleting}
          />
        </div>
      ) : (
        !isDesktop && (
          <div className="absolute right-0 top-0 px-[6px] py-1">
            <DeleteButton
              deleteLoading={deleteLoading}
              onDelete={onDelete}
              currentlyDeleting={currentlyDeleting}
              setCurrentlyDeleting={setCurrentlyDeleting}
            />
          </div>
        )
      )}
    </div>
  )
}

export default FileThumbnail

// You might want to define proper types for your adsInfo
interface Media {
  id: number
  advert_listing_id: number
  file: string
  type: 'image' | 'video'
  created_at: string
  updated_at: string
}

interface AdsInfo {
  id: number
  title: string
  media: Media[]
  // ... other properties
}

interface FileThumbnailProps {
  file: File
  onDelete: () => void
  deleteLoading: boolean
}
