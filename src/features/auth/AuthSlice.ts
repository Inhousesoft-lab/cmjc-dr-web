import { AppDispatch } from "@/app/store";
import { DR_ADMIN_AUTH_API } from "@/features/auth/authApi";
import { normalizeDocDestructionRoles } from "@/features/docDestruction/docDestructionAccess";
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

interface AuthError {
  status?: number;
  message: string;
}

const normalizeUser = (payload: Partial<User>): User | null => {
  if (!payload.authenticated || !payload.userId) {
    return null;
  }

  // 세션 복구 시에도 파기문서 권한 해석을 동일하게 맞춘다.
  const roles = normalizeDocDestructionRoles(
    Array.isArray(payload.roles)
      ? payload.roles.map((role) => String(role ?? "")).filter(Boolean)
      : [],
  );

  return {
    authenticated: true,
    userId: String(payload.userId ?? ""),
    userNm: String(payload.userNm ?? ""),
    instId: payload.instId ? String(payload.instId) : undefined,
    instNm: payload.instNm ? String(payload.instNm) : undefined,
    roles,
  };
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  loading: false,
};

export const login = createAsyncThunk<
  User,
  { userId: string; password: string },
  { dispatch: AppDispatch; rejectValue: AuthError }
>("auth/login", async ({ userId, password }, thunkAPI) => {
  try {
    const normalizedUserId = String(userId ?? "").trim();
    const normalizedPassword = String(password ?? "").trim();

    await https.post(DR_ADMIN_AUTH_API.login, {
      userId: normalizedUserId,
      password: normalizedPassword,
    });

    const meRes = await https.get(DR_ADMIN_AUTH_API.me);
    const payload = (meRes.data?.data ?? meRes.data ?? {}) as Partial<User>;
    const roles = normalizeDocDestructionRoles(
      Array.isArray(payload.roles)
        ? payload.roles.map((role) => String(role ?? "")).filter(Boolean)
        : [],
    );

    return {
      authenticated: Boolean(payload.authenticated ?? true),
      userId: String(payload.userId ?? ""),
      userNm: String(payload.userNm ?? ""),
      instId: payload.instId ? String(payload.instId) : undefined,
      instNm: payload.instNm ? String(payload.instNm) : undefined,
      roles,
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      status: err?.response?.status,
      message: err?.response?.data?.message ?? "로그인 실패",
    });
  }
});

export const checkSession = createAsyncThunk<
  User | null,
  void,
  { dispatch: AppDispatch; rejectValue: AuthError }
>("auth/checkSession", async (_, thunkAPI) => {
  try {
    const res = await https.get(DR_ADMIN_AUTH_API.me);
    const payload = (res.data?.data ?? res.data ?? {}) as Partial<User>;
    return normalizeUser(payload);
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 401) {
      return null;
    }

    return thunkAPI.rejectWithValue({
      status,
      message: err?.response?.data?.message ?? "세션 확인 실패",
    });
  }
});

export const extendSession = createAsyncThunk<
  User | null,
  void,
  { dispatch: AppDispatch; rejectValue: AuthError }
>("auth/extendSession", async (_, thunkAPI) => {
  try {
    await https.post(DR_ADMIN_AUTH_API.extend);

    const res = await https.get(DR_ADMIN_AUTH_API.me);
    const payload = (res.data?.data ?? res.data ?? {}) as Partial<User>;
    return normalizeUser(payload);
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      status: err?.response?.status,
      message: err?.response?.data?.message ?? "세션 연장 실패",
    });
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
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
          return;
        }

        if (!state.isAuthenticated) {
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;
        }
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;

        if (action.payload?.status === 401) {
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;
          return;
        }

        if (!state.isAuthenticated) {
          state.isAuthenticated = false;
          state.user = null;
          state.accessToken = null;
        }
      })
      .addCase(extendSession.fulfilled, (state, action) => {
        if (!action.payload) return;

        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(extendSession.rejected, (state) => {
        if (!state.isAuthenticated) {
          state.user = null;
          state.accessToken = null;
        }
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
    await https.post(DR_ADMIN_AUTH_API.logout);
  } catch (err: any) {
    console.warn(
      "[auth] logout request failed, clearing local auth state anyway",
      err?.response?.status,
      err?.response?.data?.message ?? err?.message,
    );
  } finally {
    thunkAPI.dispatch(logout());
  }
});

export default authSlice.reducer;
