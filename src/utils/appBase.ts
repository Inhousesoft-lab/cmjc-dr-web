const normalizeAppBase = (value?: string) => {
  const trimmed = String(value ?? "").trim();
  if (!trimmed || trimmed === "/") return "";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "");
};

export const appBase = normalizeAppBase(import.meta.env.VITE_APP_BASE);

export const withAppBase = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${appBase}${normalizedPath}` || normalizedPath;
};

export const stripAppBase = (pathname: string) => {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!appBase) return normalizedPath;
  if (normalizedPath === appBase) return "/";
  if (normalizedPath.startsWith(`${appBase}/`)) {
    return normalizedPath.slice(appBase.length) || "/";
  }
  return normalizedPath;
};