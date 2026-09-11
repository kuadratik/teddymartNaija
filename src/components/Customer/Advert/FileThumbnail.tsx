import {useUploadImageFileMutation} from '@/services/general/general'
import {Icon} from '@iconify/react'
import React, {useEffect, useState} from 'react'
import {useMediaQuery} from '@/hooks/use-media-query'
import Spinner from '@/components/SharedUI/Spinner'
import VideoView from '@/components/SharedUI/VideoView'

interface FileThumbnailProps {
  file: File
  onDelete: () => void
  deleteLoading: boolean
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

const FileThumbnail: React.FC<FileThumbnailProps> = ({file, onDelete, deleteLoading}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const [isHovered, setIsHovered] = useState(false)
  const [currentlyDeleting, setCurrentlyDeleting] = useState(false)

  // Determine if the file is an image or a video based on MIME type
  const isImage = file?.type?.startsWith('image/')
  const isVideo = file?.type?.startsWith('video/')

  return (
    <div
      className={`relative h-[227px] w-full overflow-hidden rounded-lg ${isVideo && 'bg-gray-300'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Conditional Rendering for Image or Video */}
      {isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-full w-full object-cover"
          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))} // Revoke object URL after load
        />
      ) : isVideo ? (
        // <div
        //   className="flex h-full w-full items-center justify-center bg-cover bg-center"
        //   style={{
        //     backgroundImage: `url(${URL.createObjectURL(file)})`
        //   }}
        //   onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
        // >
        //   {/* Optional video icon overlay or play button can be added here */}
        //   <Icon icon="mingcute:video-fill" className="text-[44px] text-black" />
        // </div>
        <VideoView className="w-full" src={URL.createObjectURL(file)} width="270" height="50" visibilityOnly={true} />
      ) : (
        <p>Unsupported file type</p>
      )}

      {/* Overlay and delete icon, visible on hover */}
      {isDesktop && isHovered && (
        <div className="absolute inset-0 flex cursor-pointer items-start justify-end bg-black bg-opacity-50 px-[6px] py-1">
          <DeleteButton
            deleteLoading={deleteLoading}
            onDelete={onDelete}
            currentlyDeleting={currentlyDeleting}
            setCurrentlyDeleting={setCurrentlyDeleting}
          />
        </div>
      )}

      {/* Delete icon, visible on mobile */}
      {!isDesktop && (
        <div className="absolute right-0 top-0 px-[6px] py-1">
          <DeleteButton
            deleteLoading={deleteLoading}
            onDelete={onDelete}
            currentlyDeleting={currentlyDeleting}
            setCurrentlyDeleting={setCurrentlyDeleting}
          />
        </div>
      )}
    </div>
  )
}

export default FileThumbnail
