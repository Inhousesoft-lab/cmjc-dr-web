import { createSlice } from '@reduxjs/toolkit'
import { selectAuthrtMenuList, getAuthrtMenu, insertAuthrtMenu, updateAuthrtMenu, saveAuthrtMenu, deleteAuthrtMenu } from './AuthrtMenuThunks'
import { mockAuthrtMenuList, AuthrtMenuPVO, AuthrtMenuRVO, AuthrtMenuListPVO, AuthrtMenuListRVO, AuthrtMenuDVO  } from './AuthrtMenuTypes'

/**
 * 대국민포털_권한메뉴기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface AuthrtMenuState {
  list: AuthrtMenuRVO[]
  totalCount: number | null
  current: AuthrtMenuRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_권한메뉴기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: AuthrtMenuState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const AuthrtMenuSlice = createSlice({
  name: 'authrtMenu',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectAuthrtMenuList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectAuthrtMenuList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectAuthrtMenuList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getAuthrtMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getAuthrtMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getAuthrtMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertAuthrtMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertAuthrtMenu.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertAuthrtMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert AuthrtMenu';
      })
      .addCase(updateAuthrtMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAuthrtMenu.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateAuthrtMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update AuthrtMenu';
      })
      .addCase(saveAuthrtMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAuthrtMenu.fulfilled, (state, action) => {
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
      .addCase(saveAuthrtMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save AuthrtMenu';
      })
      .addCase(deleteAuthrtMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAuthrtMenu.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteAuthrtMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete AuthrtMenu';
      })
  }
});

export const { clearCurrent } = AuthrtMenuSlice.actions
export default AuthrtMenuSlice.reducer
