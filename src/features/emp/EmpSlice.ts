import { createSlice } from '@reduxjs/toolkit'
import { selectEmpList, getEmp, insertEmp, updateEmp, saveEmp, deleteEmp } from './EmpThunks'
import { mockEmpList, EmpPVO, EmpRVO, EmpListPVO, EmpListRVO, EmpDVO  } from './EmpTypes'

/**
 * 대국민포털_관리자정보기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface EmpState {
  list: EmpRVO[]
  totalCount: number | null
  current: EmpRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_관리자정보기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: EmpState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const EmpSlice = createSlice({
  name: 'emp',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectEmpList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectEmpList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectEmpList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getEmp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getEmp.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getEmp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertEmp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertEmp.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertEmp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Emp';
      })
      .addCase(updateEmp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmp.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateEmp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Emp';
      })
      .addCase(saveEmp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveEmp.fulfilled, (state, action) => {
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
      .addCase(saveEmp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Emp';
      })
      .addCase(deleteEmp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmp.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteEmp.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Emp';
      })
  }
});

export const { clearCurrent } = EmpSlice.actions
export default EmpSlice.reducer
