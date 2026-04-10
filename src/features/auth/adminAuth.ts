import { DR_ADMIN_AUTH_API } from "@/features/auth/authApi";

const AUTH_STORAGE_KEY = "auth";

type AuthSessionValue = {
  acsTokenCn?: string;
};

const parseJsonSafely = <T,>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const readStoredAdminAuthToken = () => {
  if (typeof window === "undefined") return "";

  const authValue = parseJsonSafely<AuthSessionValue>(
    sessionStorage.getItem(AUTH_STORAGE_KEY),
  );

  return String(authValue?.acsTokenCn ?? "").trim();
};

export const getDrAdminAuthConfig = () => ({
  loginPath: DR_ADMIN_AUTH_API.login,
  mePath: DR_ADMIN_AUTH_API.me,
  extendPath: DR_ADMIN_AUTH_API.extend,
  logoutPath: DR_ADMIN_AUTH_API.logout,
});
