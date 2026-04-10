import { ComponentKey } from "@/routes/ComponentMap";
import { checkSession, login, logout, requestLogout } from "@/features/auth/AuthSlice";
import { createSlice } from "@reduxjs/toolkit";
import { getMenuList } from "./MenuThunk";

type MenuType = "MENU" | "SCN";

export interface Menu {
  menuId?: string;
  path?: string;
  label?: string; // 메뉴에 표시될 이름
  menuType?: MenuType;
  permission?: string | string[];
  element?: {
    ko?: ComponentKey;
    en?: ComponentKey;
  };
  menu?: boolean;
  children?: Menu[];
}

//
interface MenuState {
  list: Menu[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
const initialState: MenuState = {
  list: [],
  loading: false,
  loaded: false,
  error: null,
};

const resetMenuState = (state: MenuState) => {
  state.list = [];
  state.loading = false;
  state.loaded = false;
  state.error = null;
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMenuList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenuList.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
        state.loaded = true;
        state.error = null;
      })
      .addCase(getMenuList.rejected, (state, action) => {
        state.loading = false;
        // 로그인 안 된 경우는 무시
        if (action.payload === "NOT_AUTHENTICATED") {
          state.loaded = false;
          return;
        }

        state.loaded = true;
        state.error = action.error?.message || "메뉴 조회 실패";
      })
      .addCase(logout, (state) => {
        resetMenuState(state);
      })
      .addCase(requestLogout.fulfilled, (state) => {
        resetMenuState(state);
      })
      .addCase(login.rejected, (state) => {
        resetMenuState(state);
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        if (!action.payload) {
          resetMenuState(state);
        }
      });
  },
});

export default menuSlice.reducer;
