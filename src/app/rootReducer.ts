import { combineReducers } from '@reduxjs/toolkit'
import menuReducer from '@/features/auth/MenuSlice'
import uiReducer from '@/features/ui/uiSlice'

const rootReducer = combineReducers({
  ui: uiReducer,
  menu: menuReducer,
})

export default rootReducer
