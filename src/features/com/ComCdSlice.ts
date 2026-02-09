import { createSlice } from '@reduxjs/toolkit'
import { selectComCdList, getComCd, insertComCd, updateComCd, saveComCd, deleteComCd } from './ComCdThunks'
import { mockComCdList, ComCdPVO, ComCdRVO, ComCdListPVO, ComCdListRVO, ComCdDVO  } from './ComCdTypes'

/**
 * 공통_공통코드기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface ComCdState {
  list: ComCdRVO[]
  totalCount: number | null
  current: ComCdRVO | null
  loading: boolean
  error: string | null
}

/**
 * 공통_공통코드기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: ComCdState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const ComCdSlice = createSlice({
  name: 'comCd',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectComCdList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectComCdList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectComCdList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getComCd.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getComCd.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getComCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertComCd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertComCd.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertComCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert ComCd';
      })
      .addCase(updateComCd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComCd.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateComCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update ComCd';
      })
      .addCase(saveComCd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveComCd.fulfilled, (state, action) => {
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
      .addCase(saveComCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save ComCd';
      })
      .addCase(deleteComCd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComCd.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteComCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete ComCd';
      })
  }
});

export const { clearCurrent } = ComCdSlice.actions
export default ComCdSlice.reducer
