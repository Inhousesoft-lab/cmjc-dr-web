import { AppDispatch } from "@/app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { https } from "@shared/utils/https";

interface User {
  authenticated: boolean;
  userId: string;
  userNm: string;
  instId?: string;
  instNm?: string;
  roles: string[];
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

export const login = createAsyncThunk<
  User,
  { userId: string; password: string },
  { dispatch: AppDispatch; rejectValue: string }
>("auth/login", async ({ userId, password }, thunkAPI) => {
  try {
    const res = await https.post("/api/dr/temp/auth/login", {
      userId,
      password,
    });

    const payload = (res.data?.data ?? res.data ?? {}) as Partial<User>;
    return {
      authenticated: Boolean(payload.authenticated ?? true),
      userId: String(payload.userId ?? ""),
      userNm: String(payload.userNm ?? ""),
      instId: payload.instId ? String(payload.instId) : undefined,
      instNm: payload.instNm ? String(payload.instNm) : undefined,
      roles: Array.isArray(payload.roles)
        ? payload.roles.map((role) => String(role ?? "")).filter(Boolean)
        : [],
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message ?? "로그인 실패",
    );
  }
});

export const checkSession = createAsyncThunk<
  User | null,
  void,
  { dispatch: AppDispatch; rejectValue: string }
>("auth/checkSession", async (_, thunkAPI) => {
  try {
    const res = await https.get("/api/dr/temp/auth/me");
    const payload = (res.data?.data ?? res.data ?? {}) as Partial<User>;

    if (!payload.authenticated || !payload.userId) {
      return null;
    }

    return {
      authenticated: true,
      userId: String(payload.userId ?? ""),
      userNm: String(payload.userNm ?? ""),
      instId: payload.instId ? String(payload.instId) : undefined,
      instNm: payload.instNm ? String(payload.instNm) : undefined,
      roles: Array.isArray(payload.roles)
        ? payload.roles.map((role) => String(role ?? "")).filter(Boolean)
        : [],
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message ?? "세션 확인 실패",
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
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = Boolean(action.payload);
        state.user = action.payload;
        if (!action.payload) {
          state.accessToken = null;
        }
      })
      .addCase(checkSession.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      });
  },
});

export const { logout } = authSlice.actions;

export const requestLogout = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; rejectValue: string }
>("auth/logout", async (_, thunkAPI) => {
  let errorMessage: string | null = null;

  try {
    await https.post("/api/dr/auth/logout");
  } catch (err: any) {
    errorMessage = err.response?.data?.message ?? "Logout failed";
  } finally {
    thunkAPI.dispatch(logout());
  }

  if (errorMessage) {
    throw thunkAPI.rejectWithValue(errorMessage);
  }
});

export default authSlice.reducer;
