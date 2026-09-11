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

// // Takes a grade string and returns a corresponding color in hexadecimal format.
export const getIcon = (currency: string) => {
  switch (currency) {
    case 'NGN':
      return 'mdi:naira'
    case 'USD':
      return 'healthicons:dollar'
    default:
      return 'healthicons:dollar'
  }
}

export interface BulkUploadProductType {
  name: string
  category: string
  price: string
  quantity: string
  weight: string
  discount: string
  discounted_price: string
  discount_start_date: string
  discount_end_date: string
  display_price: string
  measurement: {
    unit: string
    value: string
  }[]
  size: string[]
  sizeText: string
  brand: string
  tags: string[]
  tagText: string
  product_model: string
  images?: string[]
  material: string
  color: string
  description: string
  additional_information: string
  first_upload: any
  variants: {
    name: string
    quantity: string
    size: any
    price: string
    weight: string
    color: string
    discount: string
    discounted_price: string
    discount_start_date: string
    discount_end_date: string
    display_price: string
    measurement: {
      unit: string
      value: string
    }[]

    images: any[]
    variantId?: number
  }[]
  size_chart_title: string
}
