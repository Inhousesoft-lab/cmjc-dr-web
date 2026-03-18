import { AppDispatch } from "@/app/store";
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
  { dispatch: AppDispatch; rejectValue: string }
>("auth/login", async ({ userId, password }, thunkAPI) => {
  try {
    const normalizedUserId = String(userId ?? "").trim();
    const normalizedPassword = String(password ?? "").trim();

    const res = await https.post("/api/dr/temp/auth/login", {
      userId: normalizedUserId,
      password: normalizedPassword,
    });

    const payload = (res.data?.data ?? res.data ?? {}) as Partial<User>;
    // 로그인 직후 받은 권한셋도 같은 규칙으로 보정한다.
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
    // 운영/임시 세션 엔드포인트를 순서대로 확인한다.
    for (const path of ["/api/dr/auth/me", "/api/dr/temp/auth/me"]) {
      try {
        const res = await https.get(path);
        const payload = (res.data?.data ?? res.data ?? {}) as Partial<User>;
        const normalized = normalizeUser(payload);
        if (normalized) {
          return normalized;
        }
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          throw error;
        }
      }
    }

    return null;
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
      .addCase(checkSession.rejected, (state) => {
        state.loading = false;
        if (!state.isAuthenticated) {
          state.isAuthenticated = false;
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
