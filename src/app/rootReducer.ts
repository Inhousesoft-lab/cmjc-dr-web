import { combineReducers } from '@reduxjs/toolkit'
import autheducer from "@/features/auth/AuthSlice";
import docClsfReducer from "@/features/clsf/DocClsfSlice";
import menuReducer from '@/features/auth/MenuSlice'
import uiReducer from '@/features/ui/uiSlice'

const rootReducer = combineReducers({
  auth: autheducer,
  docClsf: docClsfReducer,
  menu: menuReducer,
  ui: uiReducer,
})

export default rootReducer
