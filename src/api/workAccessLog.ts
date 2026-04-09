import { InternalAxiosRequestConfig } from "axios";
import { DR_ADMIN_AUTH_API } from "@/features/auth/authApi";

const WORK_ACCESS_LOG_EXCLUDE = [
  "/api/dr/auth/work-access-log/insert",
  "/api/dr/auth/personal-info-access-log/insert",
  DR_ADMIN_AUTH_API.sessionCheck,
  "/api/dr/menus/tree/authorized",
  DR_ADMIN_AUTH_API.login,
  DR_ADMIN_AUTH_API.extend,
];

const workAccessLogRecentMap = new Map<string, number>();
const WORK_ACCESS_LOG_DEDUP_MS = 2500;
const WORK_ACCESS_LOG_MAX_FIELD_LENGTH = 400;
const WORK_ACCESS_LOG_REDACTED = "[redacted]";
const WORK_ACCESS_LOG_DROPPED = "[filtered]";
const WORK_ACCESS_LOG_SAFE_QUERY_KEYS = new Set([
  "lang",
  "locale",
  "page",
  "pagenum",
  "pagesize",
  "size",
  "sort",
  "order",
  "direction",
  "tab",
  "menu",
  "menuid",
  "view",
  "mode",
  "type",
  "status",
  "step",
  "year",
  "month",
  "from",
  "to",
  "fromdate",
  "todate",
  "startdate",
  "enddate",
  "redirectbind",
  "doclclsfno",
  "docmclsfno",
  "docsclsfno",
  "infomnbdagreyn",
  "hldprdchangedonly",
  "prvcinclyn",
  "useen",
]);
const WORK_ACCESS_LOG_SENSITIVE_QUERY_KEY_PATTERNS = [
  /token/i,
  /auth/i,
  /session/i,
  /password/i,
  /passwd/i,
  /secret/i,
  /key/i,
  /sign/i,
  /otp/i,
  /code/i,
  /id$/i,
  /user/i,
  /name/i,
  /nm$/i,
  /email/i,
  /mail/i,
  /phone/i,
  /mobile/i,
  /tel/i,
  /addr/i,
  /ip/i,
  /rrn/i,
  /jumin/i,
  /birth/i,
  /corp/i,
  /biz/i,
  /docno/i,
  /docttl/i,
  /title/i,
  /keyword/i,
  /search/i,
  /^q$/i,
  /query/i,
  /text/i,
  /memo/i,
  /sql/i,
  /content/i,
];

const getPersistedAuthUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const persistedRoot = sessionStorage.getItem("persist:root");
    if (!persistedRoot) return null;

    const parsedRoot = JSON.parse(persistedRoot);
    const authState = typeof parsedRoot.auth === "string" ? JSON.parse(parsedRoot.auth) : parsedRoot.auth;

    return authState?.user ?? null;
  } catch {
    return null;
  }
};

const truncateLogValue = (value: string) => value.slice(0, WORK_ACCESS_LOG_MAX_FIELD_LENGTH);

const isSafeQueryKey = (key: string) => WORK_ACCESS_LOG_SAFE_QUERY_KEYS.has(key.toLowerCase());

const isSensitiveQueryKey = (key: string) => {
  const normalized = key.toLowerCase();
  return WORK_ACCESS_LOG_SENSITIVE_QUERY_KEY_PATTERNS.some((pattern) => pattern.test(normalized));
};

const shouldDropQueryValue = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return false;

  return (
    normalized.length > 120 ||
    /[@]/.test(normalized) ||
    /%40/i.test(normalized) ||
    /\b\d{6,}\b/.test(normalized) ||
    /^[A-Za-z0-9+/_=-]{24,}$/.test(normalized)
  );
};

const sanitizeSearchParams = (searchParams: URLSearchParams) => {
  const sanitized = new URLSearchParams();

  for (const [key, value] of searchParams.entries()) {
    if (isSafeQueryKey(key)) {
      sanitized.append(key, value);
      continue;
    }

    if (isSensitiveQueryKey(key)) {
      sanitized.append(key, WORK_ACCESS_LOG_REDACTED);
      continue;
    }

    sanitized.append(key, shouldDropQueryValue(value) ? WORK_ACCESS_LOG_DROPPED : value);
  }

  return sanitized.toString();
};

const normalizeLogPath = (value?: string | null) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw, window.location.origin);
    const sanitizedSearch = sanitizeSearchParams(parsed.searchParams);
    const normalized = `${parsed.pathname}${sanitizedSearch ? `?${sanitizedSearch}` : ""}`;
    return truncateLogValue(normalized);
  } catch {
    return truncateLogValue(raw.split("#")[0]);
  }
};

const shouldSkipWorkAccessLog = (url?: string) => {
  const normalizedUrl = normalizeLogPath(url);
  return !normalizedUrl || WORK_ACCESS_LOG_EXCLUDE.some((path) => normalizedUrl.includes(path));
};

export const fireWorkAccessLog = (config: InternalAxiosRequestConfig | any) => {
  if (typeof window === "undefined") return;

  const url = String(config?.url ?? "");
  if (shouldSkipWorkAccessLog(url)) return;

  const user = getPersistedAuthUser();
  const userId = String(user?.userId ?? "").trim();
  if (!userId) return;

  const method = String(config?.method ?? "GET").toUpperCase();
  const nowTs = Date.now();
  const now = new Date(nowTs).toISOString();
  const pagePath = normalizeLogPath(`${window.location.pathname}${window.location.search}`);
  const apiPath = normalizeLogPath(url);
  const dedupKey = `${pagePath}::${method}`;
  const lastLoggedAt = workAccessLogRecentMap.get(dedupKey) ?? 0;

  if (nowTs - lastLoggedAt < WORK_ACCESS_LOG_DEDUP_MS) return;

  workAccessLogRecentMap.set(dedupKey, nowTs);

  void fetch("/api/dr/auth/work-access-log/insert", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      urlAddr: pagePath,
      taskSeCdNo: "DR",
      cntnDt: now,
      acsrNm: String(user?.userNm ?? ""),
      rqstrId: userId,
      flfmtTaskCd: method,
      etcMemoCn: apiPath,
      prvcInclYn: "N",
      regDt: now,
      mdfcnDt: now,
      rgtrId: userId,
      mdfrId: userId,
    }),
  }).catch(() => {
    workAccessLogRecentMap.delete(dedupKey);
  });
};
