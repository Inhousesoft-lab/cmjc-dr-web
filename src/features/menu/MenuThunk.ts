import { AppDispatch, RootState } from "@/app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Menu } from "./MenuSlice";
import https from "@/api/axiosInstance";

export const getMenuList = createAsyncThunk<
  Menu[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("menus/tree", async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return rejectWithValue("NOT_AUTHENTICATED");
  }

  try {
    const res = await https.get("/api/dr/menus/tree/authorized");
    if (res.status !== 200) {
      throw new Error("메뉴 조회 실패");
    }
    return res.data.list as Menu[];
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "알 수 없는 오류",
    );
  }
});
