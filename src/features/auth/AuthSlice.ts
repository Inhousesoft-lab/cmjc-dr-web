import { AppDispatch } from "@/app/store";
import { getDrAdminAuthConfig } from "@/features/auth/adminAuth";
import { normalizeDocDestructionRoles } from "@/features/docDestruction/docDestructionAccess";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { https } from "@shared/utils/https";

interface User {
  authenticated: boolean;
  userId: string;
  userNm: string;
  instId?: string;
  instNm?: string;
  deptNo?: string;
  deptNm?: string;
  authrtCd?: string;
  roles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  sessionChecking: boolean;
  loginSubmitting: boolean;
  initialized: boolean;
}

interface AuthError {
  status?: number;
  message: string;
}

type LoginArgs = { userId: string; password: string };

const normalizeUser = (payload: Partial<User>): User | null => {
  if (!payload.authenticated || !payload.userId) {
    return null;
  }

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
    deptNo: payload.deptNo ? String(payload.deptNo) : undefined,
    deptNm: payload.deptNm ? String(payload.deptNm) : undefined,
    authrtCd: payload.authrtCd ? String(payload.authrtCd) : undefined,
    roles,
  };
};

const fetchCurrentUser = async () => {
  const { mePath } = getDrAdminAuthConfig();
  const meRes = await https.get(mePath);
  const payload = (meRes.data?.data ?? meRes.data ?? {}) as Partial<User>;

  return normalizeUser(payload);
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  sessionChecking: false,
  loginSubmitting: false,
  initialized: false,
};

const clearAuthState = (state: AuthState) => {
  state.isAuthenticated = false;
  state.user = null;
};

export const login = createAsyncThunk<
  User,
  LoginArgs,
  { dispatch: AppDispatch; rejectValue: AuthError }
>("auth/login", async (args, thunkAPI) => {
  try {
    const { loginPath } = getDrAdminAuthConfig();
    const normalizedUserId = String(args.userId ?? "").trim();
    const normalizedPassword = String(args.password ?? "").trim();

    await https.post(loginPath, {
      userId: normalizedUserId,
      password: normalizedPassword,
    });

    const user = await fetchCurrentUser();

    if (!user) {
      return thunkAPI.rejectWithValue({
        message: "로그인 사용자 정보를 확인하지 못했습니다.",
      });
    }

    return user;
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      status: err?.response?.status,
      message: err?.response?.data?.message ?? "로그인에 실패했습니다.",
    });
  }
});

export const checkSession = createAsyncThunk<
  User | null,
  void,
  { dispatch: AppDispatch; rejectValue: AuthError }
>("auth/checkSession", async (_, thunkAPI) => {
  try {
    return await fetchCurrentUser();
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 401) {
      return null;
    }

    return thunkAPI.rejectWithValue({
      status,
      message: err?.response?.data?.message ?? "세션 확인에 실패했습니다.",
    });
  }
});

export const extendSession = createAsyncThunk<
  User | null,
  void,
  { dispatch: AppDispatch; rejectValue: AuthError }
>("auth/extendSession", async (_, thunkAPI) => {
  try {
    const { extendPath } = getDrAdminAuthConfig();
    await https.post(extendPath);

    return await fetchCurrentUser();
  } catch (err: any) {
    const status = err?.response?.status;

    if (status === 401 || status === 403) {
      thunkAPI.dispatch(logout());
    }

    return thunkAPI.rejectWithValue({
      status,
      message: err?.response?.data?.message ?? "세션 연장에 실패했습니다.",
    });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      clearAuthState(state);
      state.sessionChecking = false;
      state.loginSubmitting = false;
      state.initialized = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.loginSubmitting = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginSubmitting = false;
        state.initialized = true;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.loginSubmitting = false;
        state.initialized = true;
        clearAuthState(state);
      })
      .addCase(checkSession.pending, (state) => {
        state.sessionChecking = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.sessionChecking = false;
        state.initialized = true;

        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
          return;
        }

        clearAuthState(state);
      })
      .addCase(checkSession.rejected, (state) => {
        state.sessionChecking = false;
        state.initialized = true;
        clearAuthState(state);
      })
      .addCase(extendSession.fulfilled, (state, action) => {
        state.initialized = true;

        if (!action.payload) {
          clearAuthState(state);
          return;
        }

        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(extendSession.rejected, (state, action) => {
        state.initialized = true;

        if (
          action.payload?.status === 401 ||
          action.payload?.status === 403 ||
          !state.isAuthenticated
        ) {
          clearAuthState(state);
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
  const { logoutPath } = getDrAdminAuthConfig();

  try {
    await https.post(logoutPath);
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
