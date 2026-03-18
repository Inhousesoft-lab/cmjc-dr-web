const UNAUTHORIZED_EVENT_NAME = "app:unauthorized";

const AUTH_EXCLUDED_PATHS = [
  "/api/dr/temp/auth/login",
  "/api/dr/auth/logout",
  "/api/dr/temp/auth/logout",
];

let unauthorizedDispatched = false;

export const isExcludedUnauthorizedRequest = (url?: string | null) => {
  const requestUrl = String(url ?? "");
  return AUTH_EXCLUDED_PATHS.some((path) => requestUrl.includes(path));
};

export const notifyUnauthorized = (requestUrl?: string | null) => {
  if (unauthorizedDispatched) return;
  if (isExcludedUnauthorizedRequest(requestUrl)) return;

  unauthorizedDispatched = true;
  window.dispatchEvent(
    new CustomEvent(UNAUTHORIZED_EVENT_NAME, {
      detail: { requestUrl: String(requestUrl ?? "") },
    }),
  );
};

export const resetUnauthorizedFlag = () => {
  unauthorizedDispatched = false;
};

export { UNAUTHORIZED_EVENT_NAME };
