import { createSlice } from '@reduxjs/toolkit'
import { selectInstList, getInst, insertInst, updateInst, saveInst, deleteInst } from './InstThunks'
import { mockInstList, InstPVO, InstRVO, InstListPVO, InstListRVO, InstDVO  } from './InstTypes'

/**
 * 대국민포털_기관정보기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface InstState {
  list: InstRVO[]
  totalCount: number | null
  current: InstRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_기관정보기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: InstState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const InstSlice = createSlice({
  name: 'inst',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectInstList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectInstList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectInstList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getInst.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getInst.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getInst.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertInst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertInst.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertInst.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Inst';
      })
      .addCase(updateInst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInst.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateInst.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Inst';
      })
      .addCase(saveInst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveInst.fulfilled, (state, action) => {
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
      .addCase(saveInst.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Inst';
      })
      .addCase(deleteInst.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInst.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteInst.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Inst';
      })
  }
});

export const { clearCurrent } = InstSlice.actions
export default InstSlice.reducer
