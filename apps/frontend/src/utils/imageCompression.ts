/**
 * Compresses an image file to reduce size while maintaining quality
 * @param file - The image file to compress
 * @param maxWidth - Maximum width of the compressed image (default: 1600px)
 * @param maxHeight - Maximum height of the compressed image (default: 1600px)
 * @param quality - Compression quality between 0 and 1 (default: 0.9)
 * @param convertToWebP - Whether to convert image to WebP format (default: false)
 * @param smartCompression - Automatically adjust settings based on image (default: false)
 * @returns Promise that resolves to a compressed File object
 */
export const compressImage = async (
  file: File,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.9,
  convertToWebP = false,
  smartCompression = false
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Check if WebP is requested but browser doesn't support it
    if (convertToWebP && !supportsWebP()) {
      console.warn("Browser doesn't support WebP. Falling back to original format.")
      convertToWebP = false
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = event => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        // Original dimensions
        const origWidth = img.width
        const origHeight = img.height

        // If using smart compression, adjust quality and dimensions based on original file
        if (smartCompression) {
          // For already small images, use higher quality
          if (origWidth <= maxWidth && origHeight <= maxHeight) {
            quality = Math.min(0.95, quality + 0.1) // Increase quality but cap at 0.95
          }

          // For very large images, we can use larger dimensions to maintain details
          if (origWidth > 3000 || origHeight > 3000) {
            maxWidth = Math.max(maxWidth, 2000)
            maxHeight = Math.max(maxHeight, 2000)
          }
        }

        // Calculate new dimensions while maintaining aspect ratio
        let width = origWidth
        let height = origHeight

        // Only resize if the image is larger than max dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            // Image is wider than our target ratio
            height = Math.round(height * (maxWidth / width))
            width = maxWidth
          } else {
            // Image is taller than our target ratio
            width = Math.round(width * (maxHeight / height))
            height = maxHeight
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }

        // Apply sharpen for resized images to counter blurriness
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Determine output format
        const outputType = convertToWebP ? 'image/webp' : file.type

        // Get file extension for the new filename
        const fileExtension = convertToWebP ? '.webp' : getFileExtension(file.name)
        const fileName = convertToWebP ? file.name.substring(0, file.name.lastIndexOf('.')) + '.webp' : file.name

        // Convert to file
        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'))
              return
            }

            // Create new file with new format if applicable
            const newFile = new File([blob], fileName, {
              type: outputType,
              lastModified: Date.now()
            })

            resolve(newFile)
          },
          outputType,
          quality
        )
      }

      img.onerror = () => {
        reject(new Error('Image loading error'))
      }
    }

    reader.onerror = () => {
      reject(new Error('File reading error'))
    }
  })
}

/**
 * Checks if the browser supports WebP format
 * @returns Boolean indicating WebP support
 */
const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas')
  if (canvas && typeof canvas.toDataURL === 'function') {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }
  return false
}

/**
 * Gets the file extension from a filename
 * @param filename - The filename to extract extension from
 * @returns The file extension including the dot
 */
const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : ''
}
