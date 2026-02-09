import { createSlice } from '@reduxjs/toolkit'
import { selectAuthrtChgHstryList, getAuthrtChgHstry, insertAuthrtChgHstry, updateAuthrtChgHstry, saveAuthrtChgHstry, deleteAuthrtChgHstry } from './AuthrtChgHstryThunks'
import { mockAuthrtChgHstryList, AuthrtChgHstryPVO, AuthrtChgHstryRVO, AuthrtChgHstryListPVO, AuthrtChgHstryListRVO, AuthrtChgHstryDVO  } from './AuthrtChgHstryTypes'

/**
 * 대국민포털_권한변경이력기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface AuthrtChgHstryState {
  list: AuthrtChgHstryRVO[]
  totalCount: number | null
  current: AuthrtChgHstryRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_권한변경이력기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: AuthrtChgHstryState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const AuthrtChgHstrySlice = createSlice({
  name: 'authrtChgHstry',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectAuthrtChgHstryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectAuthrtChgHstryList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectAuthrtChgHstryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getAuthrtChgHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getAuthrtChgHstry.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getAuthrtChgHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertAuthrtChgHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertAuthrtChgHstry.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertAuthrtChgHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert AuthrtChgHstry';
      })
      .addCase(updateAuthrtChgHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthrtChgHstry.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateAuthrtChgHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update AuthrtChgHstry';
      })
      .addCase(saveAuthrtChgHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAuthrtChgHstry.fulfilled, (state, action) => {
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
      .addCase(saveAuthrtChgHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save AuthrtChgHstry';
      })
      .addCase(deleteAuthrtChgHstry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthrtChgHstry.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteAuthrtChgHstry.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete AuthrtChgHstry';
      })
  }
});

export const { clearCurrent } = AuthrtChgHstrySlice.actions
export default AuthrtChgHstrySlice.reducer
