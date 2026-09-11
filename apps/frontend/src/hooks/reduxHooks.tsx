import {AppDispatch, AppState} from '@/redux/store'
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
