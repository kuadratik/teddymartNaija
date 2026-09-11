export interface BulkUploadProductType {
  product_name: string
  category: string
  product_price: string
  quantity: string
  discount: string
  discounted_price: string
  measurement: string
  size: string
  brand: string
  tags: string
  product_model: string
  material: string
  color: string
  description: string
  additional_description: string
  first_upload: any
  variants: {weight: string; product_model: string; size: any; price: string; color: string; discount: string}[]
}

// // Takes a grade string and returns a corresponding color in hexadecimal format.
