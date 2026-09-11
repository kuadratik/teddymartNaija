import React from 'react'
import {twMerge} from 'tailwind-merge'

interface VideoViewComponent {
  src?: string
  className?: string
  width?: string
  height?: string
  visibilityOnly?: boolean
}

const VideoView = ({src, className, width, height, visibilityOnly = false}: VideoViewComponent) => {
  const videoRef = React.useRef(null)

  // Play video on hover
  const handleMouseEnter = () => {
    if (videoRef.current) {
      // @ts-ignore
      videoRef.current.play()
    }
  }

  // Pause and reset video when mouse leaves
  const handleMouseLeave = () => {
    if (videoRef.current) {
      // @ts-ignore

      videoRef.current.pause()
      // @ts-ignore

      videoRef.current.currentTime = 0 // Reset to the beginning
    }
  }

  return (
    <video
      ref={videoRef}
      src={src}
      width={width}
      height={height}
      className={twMerge('h-full rounded-lg object-cover', className)}
      // muted
      onError={(error: any) => {
        error.currentTarget.src = '/assets/default_banner.jpg'
      }}
      loop // Optional: loops the video
      onMouseEnter={visibilityOnly ? undefined : handleMouseEnter}
      onMouseLeave={visibilityOnly ? undefined : handleMouseLeave}
      style={{cursor: 'pointer'}}
    />
  )
}

export default VideoView
