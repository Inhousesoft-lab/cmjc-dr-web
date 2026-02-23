import { AppDispatch } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { https } from "@shared/utils/https";
// import {
//   clearMyStudy,
//   fetchCurrentStudy,
//   fetchMyStudyList,
// } from "@/features/studyMy/StudyMySlice";

interface User {
  username: string;
  authorities: Record<string, string>;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  loading: false,
};

// ✅ 실제 로그인 API 연동
export const login = createAsyncThunk<
  any,
  { userId: string; password: string },
  { dispatch: AppDispatch; rejectValue: string }
>("auth/login", async ({ userId, password }, thunkAPI) => {
  try {
    const res = await https.post("/api/ecrf/temp/auth/login", {
      userId,
      password,
    });

    // thunkAPI.dispatch(fetchMyStudyList());
    // thunkAPI.dispatch(fetchCurrentStudy());

    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message ?? "로그인 실패",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      //localStorage.removeItem("accessToken");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        // state.accessToken = action.payload.accessToken;

        // // 🔐 토큰 저장
        // localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export const requestLogout = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; rejectValue: string }
>("auth/logout", async (_, thunkAPI) => {
  try {
    await https.post("/api/ecrf/auth/logout");
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message ?? "Logout failed",
    );
  } finally {
    thunkAPI.dispatch(logout());
    // thunkAPI.dispatch(clearMyStudy());
  }
});
export default authSlice.reducer;
