import {useRef, useState} from 'react'
import html2canvas from 'html2canvas'

interface DownloadOptions {
  fileName: string
  backgroundColor?: string
  scale?: number
  width?: number
  format?: 'jpg' | 'png'
  quality?: number
}

export const useElementDownload = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)

const downloadAsImage = async ({
  fileName,
  backgroundColor = '#2E2E2E',
  scale = 1.2,
  width = 450,
  format = 'jpg',
  quality = 1.0
}: DownloadOptions) => {
  if (!elementRef.current) return

  try {
    setIsDownloading(true)

    // Force a reflow
    elementRef.current.offsetHeight
    // Wait for any potential rendering
    await new Promise(resolve => setTimeout(resolve, 300))

    const canvas = await html2canvas(elementRef.current, {
      scale,
      backgroundColor,
      logging: true,
      useCORS: true,
      allowTaint: true,
      width,
      height: 200, // Added fixed height
      windowWidth: width,
      windowHeight: 200, // Added window height to match
      removeContainer: true
    })

    const image = canvas.toDataURL(`image/${format}`, quality)
    const link = document.createElement('a')
    link.download = fileName
    link.href = image
    link.click()
  } catch (error) {
    console.error('Error generating image:', error)
    throw error
  } finally {
    setIsDownloading(false)
  }
}


  return {
    elementRef,
    isDownloading,
    downloadAsImage
  }
}
