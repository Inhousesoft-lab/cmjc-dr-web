import { createSlice } from '@reduxjs/toolkit'
import { selectPicAuthrtList, getPicAuthrt, insertPicAuthrt, updatePicAuthrt, savePicAuthrt, deletePicAuthrt } from './PicAuthrtThunks'
import { mockPicAuthrtList, PicAuthrtPVO, PicAuthrtRVO, PicAuthrtListPVO, PicAuthrtListRVO, PicAuthrtDVO  } from './PicAuthrtTypes'

/**
 * 대국민포털_담당자권한기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface PicAuthrtState {
  list: PicAuthrtRVO[]
  totalCount: number | null
  current: PicAuthrtRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_담당자권한기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: PicAuthrtState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const PicAuthrtSlice = createSlice({
  name: 'picAuthrt',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectPicAuthrtList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectPicAuthrtList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectPicAuthrtList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getPicAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getPicAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getPicAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertPicAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertPicAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertPicAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert PicAuthrt';
      })
      .addCase(updatePicAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePicAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updatePicAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update PicAuthrt';
      })
      .addCase(savePicAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePicAuthrt.fulfilled, (state, action) => {
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
      .addCase(savePicAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save PicAuthrt';
      })
      .addCase(deletePicAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePicAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deletePicAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete PicAuthrt';
      })
  }
});

export const { clearCurrent } = PicAuthrtSlice.actions
export default PicAuthrtSlice.reducer
