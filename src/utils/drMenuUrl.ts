const DR_MENU_URL_HEADER = "DR-Menu-Url";

export const getCurrentDrMenuUrl = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const applyDrMenuUrlHeader = (headers?: HeadersInit) => {
  const menuUrl = getCurrentDrMenuUrl();
  if (!menuUrl) {
    return headers;
  }

  const nextHeaders = new Headers(headers);
  nextHeaders.set(DR_MENU_URL_HEADER, menuUrl);
  return nextHeaders;
};

export const setDrMenuUrlHeader = (headers?: {
  set?: (name: string, value: string) => void;
  [key: string]: unknown;
}) => {
  const menuUrl = getCurrentDrMenuUrl();
  if (!menuUrl || !headers) {
    return headers;
  }

  if (typeof headers.set === "function") {
    headers.set(DR_MENU_URL_HEADER, menuUrl);
    return headers;
  }

  headers[DR_MENU_URL_HEADER] = menuUrl;
  return headers;
};
