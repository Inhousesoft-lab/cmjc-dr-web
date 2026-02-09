import { createSlice } from '@reduxjs/toolkit'
import { selectTrmsSttList, getTrmsStt, insertTrmsStt, updateTrmsStt, saveTrmsStt, deleteTrmsStt } from './TrmsSttThunks'
import { mockTrmsSttList, TrmsSttPVO, TrmsSttRVO, TrmsSttListPVO, TrmsSttListRVO, TrmsSttDVO  } from './TrmsSttTypes'

/**
 * 대국민포털_약관법령기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface TrmsSttState {
  list: TrmsSttRVO[]
  totalCount: number | null
  current: TrmsSttRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_약관법령기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: TrmsSttState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const TrmsSttSlice = createSlice({
  name: 'trmsStt',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectTrmsSttList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectTrmsSttList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectTrmsSttList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getTrmsStt.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getTrmsStt.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getTrmsStt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertTrmsStt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertTrmsStt.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertTrmsStt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert TrmsStt';
      })
      .addCase(updateTrmsStt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrmsStt.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateTrmsStt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update TrmsStt';
      })
      .addCase(saveTrmsStt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveTrmsStt.fulfilled, (state, action) => {
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
      .addCase(saveTrmsStt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save TrmsStt';
      })
      .addCase(deleteTrmsStt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrmsStt.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteTrmsStt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete TrmsStt';
      })
  }
});

export const { clearCurrent } = TrmsSttSlice.actions
export default TrmsSttSlice.reducer
