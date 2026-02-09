import { createSlice } from '@reduxjs/toolkit'
import { selectBbsAuthrtList, getBbsAuthrt, insertBbsAuthrt, updateBbsAuthrt, saveBbsAuthrt, deleteBbsAuthrt } from './BbsAuthrtThunks'
import { mockBbsAuthrtList, BbsAuthrtPVO, BbsAuthrtRVO, BbsAuthrtListPVO, BbsAuthrtListRVO, BbsAuthrtDVO  } from './BbsAuthrtTypes'

/**
 * 대국민포털_게시판권한기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface BbsAuthrtState {
  list: BbsAuthrtRVO[]
  totalCount: number | null
  current: BbsAuthrtRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_게시판권한기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: BbsAuthrtState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const BbsAuthrtSlice = createSlice({
  name: 'bbsAuthrt',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectBbsAuthrtList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectBbsAuthrtList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectBbsAuthrtList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getBbsAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getBbsAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getBbsAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertBbsAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertBbsAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertBbsAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert BbsAuthrt';
      })
      .addCase(updateBbsAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBbsAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateBbsAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update BbsAuthrt';
      })
      .addCase(saveBbsAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveBbsAuthrt.fulfilled, (state, action) => {
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
      .addCase(saveBbsAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save BbsAuthrt';
      })
      .addCase(deleteBbsAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBbsAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteBbsAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete BbsAuthrt';
      })
  }
});

export const { clearCurrent } = BbsAuthrtSlice.actions
export default BbsAuthrtSlice.reducer
