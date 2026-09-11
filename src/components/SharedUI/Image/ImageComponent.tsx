import Image from 'next/legacy/image'
import {useState} from 'react'
import {twMerge} from 'tailwind-merge'

interface IProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  quality?: number
}
const ImageComponent = ({src, alt, className, width, height, quality}: IProps) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true)
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      onLoadStart={() => {
        setIsLoadingImage(true)
      }}
      onLoad={() => {
        setIsLoadingImage(false)
      }}
      onError={error => {
        error.currentTarget.src = '/assets/default_banner.jpg'
        setIsLoadingImage(false)
      }}
      quality={quality}
      layout="responsive"
      className={twMerge(isLoadingImage ? 'blur-sm' : '', className)}
      width={width}
      height={height}
    />
  )
}

export default ImageComponent
