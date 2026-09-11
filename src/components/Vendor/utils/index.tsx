export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (loadEvent) {
      // Check if loadEvent.target is not null and is an instance of FileReader
      if (loadEvent.target instanceof FileReader) {
        const base64String = loadEvent.target.result
        resolve(base64String as string) // Resolve the promise with the base64 string
      } else {
        reject('Failed to read file')
      }
    }
    reader.onerror = reject // Reject the promise on read error
    reader.readAsDataURL(file) // Read the file as a Data URL (Base64)
  })
}
