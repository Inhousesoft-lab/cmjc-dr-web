import { createSlice } from '@reduxjs/toolkit'
import { selectAuthrtMenuRoleList, getAuthrtMenuRole, insertAuthrtMenuRole, updateAuthrtMenuRole, saveAuthrtMenuRole, deleteAuthrtMenuRole } from './AuthrtMenuRoleThunks'
import { mockAuthrtMenuRoleList, AuthrtMenuRolePVO, AuthrtMenuRoleRVO, AuthrtMenuRoleListPVO, AuthrtMenuRoleListRVO, AuthrtMenuRoleDVO  } from './AuthrtMenuRoleTypes'

/**
 * 대국민포털_권한메뉴롤기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface AuthrtMenuRoleState {
  list: AuthrtMenuRoleRVO[]
  totalCount: number | null
  current: AuthrtMenuRoleRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_권한메뉴롤기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: AuthrtMenuRoleState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const AuthrtMenuRoleSlice = createSlice({
  name: 'authrtMenuRole',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectAuthrtMenuRoleList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectAuthrtMenuRoleList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectAuthrtMenuRoleList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getAuthrtMenuRole.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getAuthrtMenuRole.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getAuthrtMenuRole.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertAuthrtMenuRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertAuthrtMenuRole.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertAuthrtMenuRole.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert AuthrtMenuRole';
      })
      .addCase(updateAuthrtMenuRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthrtMenuRole.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateAuthrtMenuRole.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update AuthrtMenuRole';
      })
      .addCase(saveAuthrtMenuRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAuthrtMenuRole.fulfilled, (state, action) => {
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
      .addCase(saveAuthrtMenuRole.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save AuthrtMenuRole';
      })
      .addCase(deleteAuthrtMenuRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthrtMenuRole.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteAuthrtMenuRole.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete AuthrtMenuRole';
      })
  }
});

export const { clearCurrent } = AuthrtMenuRoleSlice.actions
export default AuthrtMenuRoleSlice.reducer
