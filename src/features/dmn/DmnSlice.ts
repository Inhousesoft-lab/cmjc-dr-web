import { createSlice } from '@reduxjs/toolkit'
import { selectDmnList, getDmn, insertDmn, updateDmn, saveDmn, deleteDmn } from './DmnThunks'
import { mockDmnList, DmnPVO, DmnRVO, DmnListPVO, DmnListRVO, DmnDVO  } from './DmnTypes'

/**
 * 대국민포털_도메인기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface DmnState {
  list: DmnRVO[]
  totalCount: number | null
  current: DmnRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_도메인기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: DmnState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const DmnSlice = createSlice({
  name: 'dmn',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectDmnList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectDmnList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectDmnList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getDmn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getDmn.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getDmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertDmn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertDmn.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertDmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Dmn';
      })
      .addCase(updateDmn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDmn.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateDmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Dmn';
      })
      .addCase(saveDmn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDmn.fulfilled, (state, action) => {
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
      .addCase(saveDmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Dmn';
      })
      .addCase(deleteDmn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDmn.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteDmn.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Dmn';
      })
  }
});

export const { clearCurrent } = DmnSlice.actions
export default DmnSlice.reducer
