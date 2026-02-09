import { createSlice } from '@reduxjs/toolkit'
import { selectDeptAuthrtList, getDeptAuthrt, insertDeptAuthrt, updateDeptAuthrt, saveDeptAuthrt, deleteDeptAuthrt } from './DeptAuthrtThunks'
import { mockDeptAuthrtList, DeptAuthrtPVO, DeptAuthrtRVO, DeptAuthrtListPVO, DeptAuthrtListRVO, DeptAuthrtDVO  } from './DeptAuthrtTypes'

/**
 * 대국민포털_부서권한기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface DeptAuthrtState {
  list: DeptAuthrtRVO[]
  totalCount: number | null
  current: DeptAuthrtRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_부서권한기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: DeptAuthrtState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const DeptAuthrtSlice = createSlice({
  name: 'deptAuthrt',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectDeptAuthrtList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectDeptAuthrtList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectDeptAuthrtList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getDeptAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getDeptAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getDeptAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertDeptAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertDeptAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertDeptAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert DeptAuthrt';
      })
      .addCase(updateDeptAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeptAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateDeptAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update DeptAuthrt';
      })
      .addCase(saveDeptAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveDeptAuthrt.fulfilled, (state, action) => {
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
      .addCase(saveDeptAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save DeptAuthrt';
      })
      .addCase(deleteDeptAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeptAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteDeptAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete DeptAuthrt';
      })
  }
});

export const { clearCurrent } = DeptAuthrtSlice.actions
export default DeptAuthrtSlice.reducer
