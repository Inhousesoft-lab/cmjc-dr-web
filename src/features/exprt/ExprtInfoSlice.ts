import { createSlice } from '@reduxjs/toolkit'
import { selectExprtInfoList, getExprtInfo, insertExprtInfo, updateExprtInfo, saveExprtInfo, deleteExprtInfo } from './ExprtInfoThunks'
import { mockExprtInfoList, ExprtInfoPVO, ExprtInfoRVO, ExprtInfoListPVO, ExprtInfoListRVO, ExprtInfoDVO  } from './ExprtInfoTypes'

/**
 * 대국민포털_전문가정보기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface ExprtInfoState {
  list: ExprtInfoRVO[]
  totalCount: number | null
  current: ExprtInfoRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_전문가정보기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: ExprtInfoState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const ExprtInfoSlice = createSlice({
  name: 'exprtInfo',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectExprtInfoList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectExprtInfoList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectExprtInfoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getExprtInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getExprtInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getExprtInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertExprtInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertExprtInfo.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertExprtInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert ExprtInfo';
      })
      .addCase(updateExprtInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExprtInfo.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateExprtInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update ExprtInfo';
      })
      .addCase(saveExprtInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveExprtInfo.fulfilled, (state, action) => {
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
      .addCase(saveExprtInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save ExprtInfo';
      })
      .addCase(deleteExprtInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExprtInfo.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteExprtInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete ExprtInfo';
      })
  }
});

export const { clearCurrent } = ExprtInfoSlice.actions
export default ExprtInfoSlice.reducer
