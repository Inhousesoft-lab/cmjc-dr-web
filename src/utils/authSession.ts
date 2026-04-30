import { DR_ADMIN_AUTH_API } from "@/features/auth/authApi";
import { normalizeLang } from "@/routes/lang";
import { stripAppBase } from "@/utils/appBase";

const UNAUTHORIZED_EVENT_NAME = "app:unauthorized";
export const POST_LOGIN_REDIRECT_KEY = "postLoginRedirect";

const AUTH_EXCLUDED_PATHS = [
  DR_ADMIN_AUTH_API.login,
  DR_ADMIN_AUTH_API.logout,
];

let unauthorizedDispatched = false;
let unauthorizedRedirectInProgress = false;

const toInternalPath = (value?: string | null) => {
  const normalized = String(value ?? "").trim();
  if (!normalized.startsWith("/") || normalized.startsWith("//")) {
    return null;
  }
  return normalized;
};

const toComparablePathname = (value?: string | null) => {
  const normalized = toInternalPath(value);
  if (!normalized) return null;

  const [pathname] = normalized.split(/[?#]/, 1);
  return stripAppBase(pathname || "/");
};

export const isLoginPath = (value?: string | null) => {
  const pathname = toComparablePathname(value ?? window.location.pathname);
  if (!pathname) return false;

  const segments = pathname.split("/").filter(Boolean);
  if (normalizeLang(segments[0]) === null) return false;

  return segments[1] === "login";
};

export const canUsePostLoginRedirect = (value?: string | null) => {
  const normalized = toInternalPath(value);
  if (!normalized) return false;
  return !isLoginPath(normalized);
};

export const getPostLoginRedirect = () => {
  const stored = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  return canUsePostLoginRedirect(stored) ? stored : null;
};

export const setPostLoginRedirect = (value?: string | null) => {
  if (!canUsePostLoginRedirect(value)) {
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
    return false;
  }

  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, value as string);
  return true;
};

export const clearPostLoginRedirect = () => {
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
};

export const isExcludedUnauthorizedRequest = (url?: string | null) => {
  const requestUrl = String(url ?? "");
  return AUTH_EXCLUDED_PATHS.some((path) => requestUrl.includes(path));
};

export const notifyUnauthorized = (requestUrl?: string | null) => {
  if (unauthorizedDispatched) return;
  if (unauthorizedRedirectInProgress) return;
  if (isExcludedUnauthorizedRequest(requestUrl)) return;
  if (isLoginPath(window.location.pathname)) return;

  unauthorizedDispatched = true;
  window.dispatchEvent(
    new CustomEvent(UNAUTHORIZED_EVENT_NAME, {
      detail: { requestUrl: String(requestUrl ?? "") },
    }),
  );
};

export const beginUnauthorizedRedirect = () => {
  if (unauthorizedRedirectInProgress) return false;
  if (isLoginPath(window.location.pathname)) return false;

  unauthorizedRedirectInProgress = true;
  unauthorizedDispatched = true;
  return true;
};

export const resetUnauthorizedFlag = () => {
  unauthorizedDispatched = false;
  unauthorizedRedirectInProgress = false;
};

export { UNAUTHORIZED_EVENT_NAME };
