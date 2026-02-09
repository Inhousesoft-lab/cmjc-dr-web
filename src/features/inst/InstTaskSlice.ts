import { createSlice } from '@reduxjs/toolkit'
import { selectInstTaskList, getInstTask, insertInstTask, updateInstTask, saveInstTask, deleteInstTask } from './InstTaskThunks'
import { mockInstTaskList, InstTaskPVO, InstTaskRVO, InstTaskListPVO, InstTaskListRVO, InstTaskDVO  } from './InstTaskTypes'

/**
 * 대국민포털_기관업무기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface InstTaskState {
  list: InstTaskRVO[]
  totalCount: number | null
  current: InstTaskRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_기관업무기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: InstTaskState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const InstTaskSlice = createSlice({
  name: 'instTask',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectInstTaskList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectInstTaskList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectInstTaskList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getInstTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getInstTask.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getInstTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertInstTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertInstTask.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertInstTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert InstTask';
      })
      .addCase(updateInstTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstTask.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateInstTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update InstTask';
      })
      .addCase(saveInstTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveInstTask.fulfilled, (state, action) => {
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
      .addCase(saveInstTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save InstTask';
      })
      .addCase(deleteInstTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInstTask.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteInstTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete InstTask';
      })
  }
});

export const { clearCurrent } = InstTaskSlice.actions
export default InstTaskSlice.reducer
