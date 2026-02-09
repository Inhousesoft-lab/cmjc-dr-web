import { createSlice } from '@reduxjs/toolkit'
import { selectMenuDList, getMenuD, insertMenuD, updateMenuD, saveMenuD, deleteMenuD } from './MenuDThunks'
import { mockMenuDList, MenuDPVO, MenuDRVO, MenuDListPVO, MenuDListRVO, MenuDDVO  } from './MenuDTypes'

/**
 * 대국민포털_메뉴상세 정보 목록 조회(Redux 저장 구조) 
 */
export interface MenuDState {
  list: MenuDRVO[]
  totalCount: number | null
  current: MenuDRVO | null
  loading: boolean
  error: string | null
}

/**
 * 대국민포털_메뉴상세 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: MenuDState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null
}

const MenuDSlice = createSlice({
  name: 'menuD',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectMenuDList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectMenuDList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(selectMenuDList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';
      })
      .addCase(getMenuD.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getMenuD.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getMenuD.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertMenuD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertMenuD.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertMenuD.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert MenuD';
      })
      .addCase(updateMenuD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenuD.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateMenuD.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update MenuD';
      })
      .addCase(saveMenuD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveMenuD.fulfilled, (state, action) => {
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
      .addCase(saveMenuD.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save MenuD';
      })
      .addCase(deleteMenuD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenuD.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteMenuD.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete MenuD';
      })
  }
});

export const { clearCurrent } = MenuDSlice.actions
export default MenuDSlice.reducer
