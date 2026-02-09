import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type UiAlert = { type: 'info' | 'error' | 'success'; message: string }

export interface UiState {
  globalLoading: boolean
  alert: UiAlert | null
}

const initialState: UiState = {
  globalLoading: false,
  alert: null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = Boolean(action.payload)
    },
    showAlert(state, action: PayloadAction<UiAlert>) {
      state.alert = action.payload
    },
    clearAlert(state) {
      state.alert = null
    }
  }
})

export const { setGlobalLoading, showAlert, clearAlert } = uiSlice.actions
export default uiSlice.reducer
