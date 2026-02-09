import { createSlice } from '@reduxjs/toolkit'
import { selectAtchList, getAtch, insertAtch, updateAtch, saveAtch, deleteAtch } from './AtchThunks'
import { mockAtchList, AtchPVO, AtchRVO, AtchListPVO, AtchListRVO, AtchDVO  } from './AtchTypes'

/**
 * 공통_첨부파일기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface AtchState {
  list: AtchRVO[]
  totalCount: number | null
  current: AtchRVO | null
  loading: boolean
  error: string | null
}

/**
 * 공통_첨부파일기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: AtchState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const AtchSlice = createSlice({
  name: 'atch',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectAtchList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectAtchList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectAtchList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getAtch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getAtch.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getAtch.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertAtch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertAtch.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertAtch.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Atch';
      })
      .addCase(updateAtch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAtch.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateAtch.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Atch';
      })
      .addCase(saveAtch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAtch.fulfilled, (state, action) => {
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
      .addCase(saveAtch.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Atch';
      })
      .addCase(deleteAtch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAtch.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteAtch.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Atch';
      })
  }
});

export const { clearCurrent } = AtchSlice.actions
export default AtchSlice.reducer
