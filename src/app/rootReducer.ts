import autheducer from "@/features/auth/AuthSlice";
import { combineReducers } from '@reduxjs/toolkit'
import menuReducer from '@/features/auth/MenuSlice'
import uiReducer from '@/features/ui/uiSlice'

const rootReducer = combineReducers({
  auth: autheducer,
  ui: uiReducer,
  menu: menuReducer,
})

export default rootReducer
