import { createSlice } from '@reduxjs/toolkit'
import { selectPopupList, getPopup, insertPopup, updatePopup, savePopup, deletePopup } from './PopupThunks'
import { mockPopupList, PopupPVO, PopupRVO, PopupListPVO, PopupListRVO, PopupDVO  } from './PopupTypes'

/**
 * 대국민포털_팝업기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface PopupState {
  list: PopupRVO[]
  totalCount: number | null
  current: PopupRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_팝업기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: PopupState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const PopupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectPopupList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectPopupList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectPopupList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getPopup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getPopup.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getPopup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertPopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertPopup.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertPopup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Popup';
      })
      .addCase(updatePopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePopup.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updatePopup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Popup';
      })
      .addCase(savePopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePopup.fulfilled, (state, action) => {
        state.loading = false;
        //const saved = action.payload;
        //state.current = saved || null;
        //if(saved?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(saved.id));
        //  if(idx >= 0){
        //    state.list[idx] = { ...state.list[idx], ...saved };
        //  }else if(saved) {
        //    state.list = [saved, ...state.list];
        //    state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //  }
        //}
      })
      .addCase(savePopup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Popup';
      })
      .addCase(deletePopup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePopup.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deletePopup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Popup';
      })
  }
});

export const { clearCurrent } = PopupSlice.actions
export default PopupSlice.reducer
