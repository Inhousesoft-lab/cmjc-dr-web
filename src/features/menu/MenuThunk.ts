import { AppDispatch, RootState } from "@/app/store";
import staticMenuItems from "@/routes/menuItems";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Menu } from "./MenuSlice";

export const getMenuList = createAsyncThunk<
  Menu[],
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>("menus/tree", async (_, { getState, rejectWithValue }) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return rejectWithValue("NOT_AUTHENTICATED");
  }

  return staticMenuItems as Menu[];
});
