import { DR_ADMIN_AUTH_API } from "@/features/auth/authApi";

const AUTH_STORAGE_KEY = "auth";

type AuthSessionValue = {
  acsTokenCn?: string;
};

const INTERNAL_PORTAL_TOKEN_COOKIE_KEY = "accessToken";

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

export const readCookieValue = (cookieName: string) => {
  if (typeof document === "undefined") return "";

  const matchedCookie = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cookieName}=`));

  if (!matchedCookie) return "";

  const [, ...valueParts] = matchedCookie.split("=");
  return decodeURIComponent(valueParts.join("=")).trim();
};

export const readInternalPortalToken = () =>
  readCookieValue(INTERNAL_PORTAL_TOKEN_COOKIE_KEY) || readStoredAdminAuthToken();

export const getDrAdminAuthConfig = () => ({
  loginPath: DR_ADMIN_AUTH_API.login,
  tokenLoginPath: DR_ADMIN_AUTH_API.tokenLogin,
  mePath: DR_ADMIN_AUTH_API.me,
  extendPath: DR_ADMIN_AUTH_API.extend,
  logoutPath: DR_ADMIN_AUTH_API.logout,
});
