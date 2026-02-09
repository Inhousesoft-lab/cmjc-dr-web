import { createSlice } from '@reduxjs/toolkit'
import { selectDgstfnExmnList, getDgstfnExmn, insertDgstfnExmn, updateDgstfnExmn, saveDgstfnExmn, deleteDgstfnExmn } from './DgstfnExmnThunks'
import { mockDgstfnExmnList, DgstfnExmnPVO, DgstfnExmnRVO, DgstfnExmnListPVO, DgstfnExmnListRVO, DgstfnExmnDVO  } from './DgstfnExmnTypes'

/**
 * 대국민포털_만족도조사기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface DgstfnExmnState {
  list: DgstfnExmnRVO[]
  totalCount: number | null
  current: DgstfnExmnRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_만족도조사기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: DgstfnExmnState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const DgstfnExmnSlice = createSlice({
  name: 'dgstfnExmn',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectDgstfnExmnList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectDgstfnExmnList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectDgstfnExmnList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getDgstfnExmn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getDgstfnExmn.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getDgstfnExmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertDgstfnExmn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertDgstfnExmn.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertDgstfnExmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert DgstfnExmn';
      })
      .addCase(updateDgstfnExmn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDgstfnExmn.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateDgstfnExmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update DgstfnExmn';
      })
      .addCase(saveDgstfnExmn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDgstfnExmn.fulfilled, (state, action) => {
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
      .addCase(saveDgstfnExmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save DgstfnExmn';
      })
      .addCase(deleteDgstfnExmn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDgstfnExmn.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteDgstfnExmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete DgstfnExmn';
      })
  }
});

export const { clearCurrent } = DgstfnExmnSlice.actions
export default DgstfnExmnSlice.reducer
