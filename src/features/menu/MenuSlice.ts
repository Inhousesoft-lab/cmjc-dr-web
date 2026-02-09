import { ComponentKey } from "@/routes/ComponentMap";
import { createSlice } from "@reduxjs/toolkit";
import { getMenuList } from "./MenuThunk";

type MenuType = "MENU" | "SCN";

export interface Menu {
  menuId?: string;
  path?: string;
  label?: string; // 메뉴에 표시될 이름
  menuType?: MenuType;
  element?: {
    ko: ComponentKey;
    en: ComponentKey;
  };
  menu?: boolean;
  children?: Menu[];
}

//
interface MenuState {
  list: Menu[];
  loading: boolean;
  error: string | null;
}
const initialState: MenuState = {
  list: [],
  loading: false,
  error: null,
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
        state.error = null;
      })
      .addCase(getMenuList.rejected, (state, action) => {
        state.loading = false;
        // 로그인 안 된 경우는 무시
        if (action.payload === "NOT_AUTHENTICATED") {
          return;
        }

        state.error = action.error?.message || "메뉴 조회 실패";
      });
  },
});

export default menuSlice.reducer;
