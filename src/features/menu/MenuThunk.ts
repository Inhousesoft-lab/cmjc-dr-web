// CommonCodeThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Menu } from "./MenuSlice";
import https from "@/api/axiosInstance";

/**
 * 공통코드상세 목록 조회
 */
export const getMenuList = createAsyncThunk<
  Menu[],
  void,
  { rejectValue: string }
>("menus/tree", async (_, { rejectWithValue }) => {
  try {
    const res = await https.get("/api/menus/tree");
    if (res.status !== 200) {
      throw new Error("메뉴 조회 실패");
    }
    const list = res.data.list as Menu[];

    return list;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "알 수 없는 오류"
    );
  }
});
