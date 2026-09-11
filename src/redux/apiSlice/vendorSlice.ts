// authSlice.ts
import {IProductListType} from '@/components/Vendor/ProductListContainer'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface VendorState {
  type: 'product' | 'service'
  selectedProduct: IProductListType | null
}

const initialState: VendorState = {
  type: 'product',
  selectedProduct: null
}

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    setType(state, action: PayloadAction<{type: 'product' | 'service'}>) {
      state.type = action.payload.type
    },
    setSelectProduct(state, action: PayloadAction<IProductListType>) {
      state.selectedProduct = action.payload
    }
  }
})

export const {setType, setSelectProduct} = vendorSlice.actions
export default vendorSlice.reducer
