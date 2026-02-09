import { createSlice } from '@reduxjs/toolkit'
import { selectExprtTaskList, getExprtTask, insertExprtTask, updateExprtTask, saveExprtTask, deleteExprtTask } from './ExprtTaskThunks'
import { mockExprtTaskList, ExprtTaskPVO, ExprtTaskRVO, ExprtTaskListPVO, ExprtTaskListRVO, ExprtTaskDVO  } from './ExprtTaskTypes'

/**
 * 대국민포털_전문가업무기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface ExprtTaskState {
  list: ExprtTaskRVO[]
  totalCount: number | null
  current: ExprtTaskRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_전문가업무기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: ExprtTaskState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const ExprtTaskSlice = createSlice({
  name: 'exprtTask',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectExprtTaskList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectExprtTaskList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectExprtTaskList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getExprtTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getExprtTask.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getExprtTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertExprtTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertExprtTask.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertExprtTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert ExprtTask';
      })
      .addCase(updateExprtTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExprtTask.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateExprtTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update ExprtTask';
      })
      .addCase(saveExprtTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveExprtTask.fulfilled, (state, action) => {
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
      .addCase(saveExprtTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save ExprtTask';
      })
      .addCase(deleteExprtTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExprtTask.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteExprtTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete ExprtTask';
      })
  }
});

export const { clearCurrent } = ExprtTaskSlice.actions
export default ExprtTaskSlice.reducer
