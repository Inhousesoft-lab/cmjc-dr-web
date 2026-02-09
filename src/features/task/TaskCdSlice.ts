import { createSlice } from '@reduxjs/toolkit'
import { selectTaskCdList, getTaskCd, insertTaskCd, updateTaskCd, saveTaskCd, deleteTaskCd } from './TaskCdThunks'
import { mockTaskCdList, TaskCdPVO, TaskCdRVO, TaskCdListPVO, TaskCdListRVO, TaskCdDVO  } from './TaskCdTypes'

/**
 * 대국민포털_업무코드기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface TaskCdState {
  list: TaskCdRVO[]
  totalCount: number | null
  current: TaskCdRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_업무코드기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: TaskCdState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const TaskCdSlice = createSlice({
  name: 'taskCd',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectTaskCdList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectTaskCdList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectTaskCdList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getTaskCd.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getTaskCd.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getTaskCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertTaskCd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertTaskCd.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertTaskCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert TaskCd';
      })
      .addCase(updateTaskCd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskCd.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateTaskCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update TaskCd';
      })
      .addCase(saveTaskCd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveTaskCd.fulfilled, (state, action) => {
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
      .addCase(saveTaskCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save TaskCd';
      })
      .addCase(deleteTaskCd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskCd.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteTaskCd.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete TaskCd';
      })
  }
});

export const { clearCurrent } = TaskCdSlice.actions
export default TaskCdSlice.reducer
