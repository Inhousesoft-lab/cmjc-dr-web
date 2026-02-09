import { createSlice } from '@reduxjs/toolkit'
import { selectTrmList, getTrm, insertTrm, updateTrm, saveTrm, deleteTrm } from './TrmThunks'
import { mockTrmList, TrmPVO, TrmRVO, TrmListPVO, TrmListRVO, TrmDVO  } from './TrmTypes'

/**
 * 대국민포털_용어기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface TrmState {
  list: TrmRVO[]
  totalCount: number | null
  current: TrmRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_용어기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: TrmState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const TrmSlice = createSlice({
  name: 'trm',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectTrmList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectTrmList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectTrmList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getTrm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getTrm.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getTrm.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertTrm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertTrm.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertTrm.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Trm';
      })
      .addCase(updateTrm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrm.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateTrm.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Trm';
      })
      .addCase(saveTrm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveTrm.fulfilled, (state, action) => {
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
      .addCase(saveTrm.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Trm';
      })
      .addCase(deleteTrm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrm.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteTrm.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Trm';
      })
  }
});

export const { clearCurrent } = TrmSlice.actions
export default TrmSlice.reducer
