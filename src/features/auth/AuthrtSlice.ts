import { createSlice } from '@reduxjs/toolkit'
import { selectAuthrtList, getAuthrt, insertAuthrt, updateAuthrt, saveAuthrt, deleteAuthrt } from './AuthrtThunks'
import { mockAuthrtList, AuthrtPVO, AuthrtRVO, AuthrtListPVO, AuthrtListRVO, AuthrtDVO  } from './AuthrtTypes'

/**
 * 대국민포털_권한기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface AuthrtState {
  list: AuthrtRVO[]
  totalCount: number | null
  current: AuthrtRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_권한기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: AuthrtState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const AuthrtSlice = createSlice({
  name: 'authrt',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectAuthrtList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectAuthrtList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectAuthrtList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Authrt';
      })
      .addCase(updateAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Authrt';
      })
      .addCase(saveAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAuthrt.fulfilled, (state, action) => {
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
      .addCase(saveAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Authrt';
      })
      .addCase(deleteAuthrt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthrt.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteAuthrt.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Authrt';
      })
  }
});

export const { clearCurrent } = AuthrtSlice.actions
export default AuthrtSlice.reducer
