import { createSlice } from '@reduxjs/toolkit'
import { selectExprtAuthrtList, getExprtAuthrt, insertExprtAuthrt, updateExprtAuthrt, saveExprtAuthrt, deleteExprtAuthrt } from './ExprtAuthrtThunks'
import { mockExprtAuthrtList, ExprtAuthrtPVO, ExprtAuthrtRVO, ExprtAuthrtListPVO, ExprtAuthrtListRVO, ExprtAuthrtDVO  } from './ExprtAuthrtTypes'

/**
 * 대국민포털_전문가권한기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface ExprtAuthrtState {
  list: ExprtAuthrtRVO[]
  totalCount: number | null
  current: ExprtAuthrtRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_전문가권한기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: ExprtAuthrtState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const ExprtAuthrtSlice = createSlice({
  name: 'exprtAuthrt',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectExprtAuthrtList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectExprtAuthrtList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectExprtAuthrtList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getExprtAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getExprtAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getExprtAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertExprtAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertExprtAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertExprtAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert ExprtAuthrt';
      })
      .addCase(updateExprtAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExprtAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateExprtAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update ExprtAuthrt';
      })
      .addCase(saveExprtAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveExprtAuthrt.fulfilled, (state, action) => {
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
      .addCase(saveExprtAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save ExprtAuthrt';
      })
      .addCase(deleteExprtAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExprtAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteExprtAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete ExprtAuthrt';
      })
  }
});

export const { clearCurrent } = ExprtAuthrtSlice.actions
export default ExprtAuthrtSlice.reducer
