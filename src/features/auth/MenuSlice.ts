import { createSlice } from '@reduxjs/toolkit'
import { selectMenuList, getMenu, insertMenu, updateMenu, saveMenu, deleteMenu } from './MenuThunks'
import { mockMenuList, MenuPVO, MenuRVO, MenuListPVO, MenuListRVO, MenuDVO  } from './MenuTypes'

/**
 * 대국민포털_메뉴기본 정보 목록 조회(Redux 저장 구조) 
 */
export interface MenuState {
  list: MenuRVO[]
  totalCount: number | null
  current: MenuRVO | null
  loading: boolean
  error: string | null

  langSeCd: string | null
  loaded: boolean
}

/**
 * 대국민포털_메뉴기본 정보 목록 조회(Redux 저장 구조 초기상태) 
 */
const initialState: MenuState = {
  list: [],
  totalCount: null,
  current: null,
  loading: false,
  error: null,

  langSeCd: null,
  loaded: false
}

const MenuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearCurrent: (state) => {
      state.current = null;
    },

    // ✅ (선택) 캐시 초기화가 필요할 때 쓰기
    clearMenuCache: (state) => {
      state.list = [];
      state.totalCount = null;
      state.langSeCd = null;
      state.loaded = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectMenuList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectMenuList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.totalCount = action.payload.totalCount;

        // 어떤 언어로 로딩됐는지 기록 + loaded
        state.langSeCd = action.meta.arg?.langSeCd ?? state.langSeCd ?? null;
        state.loaded = true;
      })
      .addCase(selectMenuList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to load notice list';

        // 실패 시 loaded는 상황에 따라 유지/해제 선택 가능
        // state.loaded = false;
      })
      .addCase(getMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.current = null;
      })
      .addCase(getMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(getMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to load notice';
      })
      .addCase(insertMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(insertMenu.fulfilled, (state, action) => {
        state.loading = false;
        //const created = action.payload;
        //state.current = created || null;
        //if(created) {
        //  state.list = [created, ...state.list];
        //  state.totalCount = (state.totalCount ?? state.list.length) + 1;
        //}
      })
      .addCase(insertMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to insert Menu';
      })
      .addCase(updateMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        //state.current = updated || null;
        //if(updated?.id !== undefined) {
        //  const idx = state.list.findIndex((n) => String(n.id) === String(updated.id));
        //  if(idx >= 0)state.list[idx] = { ...state.list[idx], ...updated };
        //}
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to update Menu';
      })
      .addCase(saveMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveMenu.fulfilled, (state, action) => {
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
      .addCase(saveMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to save Menu';
      })
      .addCase(deleteMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.loading = false;
        //const deletedId = action.payload;
        //state.list = state.list.filter((n) => String(n.id) !== String(deletedId))
        //if (state.current && String(state.current.id) === String(deletedId)) {
        //  state.current = null;
        //}
        //if(typeof state.totalCount === 'number')state.totalCount = Math.max(0, state.totalCount - 1);
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error?.message || 'Failed to delete Menu';
      })
  }
});

export const { clearCurrent, clearMenuCache } = MenuSlice.actions
export default MenuSlice.reducer
