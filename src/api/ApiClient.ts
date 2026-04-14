import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { fireWorkAccessLog } from "@/api/workAccessLog";
import { notifyUnauthorized } from "@/utils/authSession";

export const getApiBaseURL = () => {
  const envUrl = String(import.meta.env.VITE_API_BASE_URL ?? "").trim();

  if (!envUrl || envUrl === "/api" || envUrl === "/api/") {
    return "/";
  }

  return envUrl;
};

export const getFileFallbackBaseURL = () => {
  const envUrl = import.meta.env.VITE_FILE_FALLBACK_BASE_URL;
  return envUrl || "";
};

const toOriginUrl = (baseURL: string, path: string) => {
  if (!baseURL) return "";
  if (!/^https?:\/\//i.test(baseURL)) return "";

  const normalizedBase = baseURL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export const resolveApiUrl = (path: string) => {
  const resolved = toOriginUrl(getApiBaseURL(), path);
  console.log("[ApiClient] resolveApiUrl", {
    baseURL: getApiBaseURL(),
    path,
    resolved: resolved || path,
  });
  return resolved || path;
};

export const resolveFallbackApiUrl = (path: string) => {
  const resolved = toOriginUrl(getFileFallbackBaseURL(), path);
  console.log("[ApiClient] resolveFallbackApiUrl", {
    baseURL: getFileFallbackBaseURL(),
    path,
    resolved,
  });
  return resolved;
};

const apiClient = axios.create({
  baseURL: getApiBaseURL(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  fireWorkAccessLog(config);

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiClient.interceptors.response.use((response: AxiosResponse) => {
  const res = response.data;
  if (res?.code && res.code !== "200") {
    return Promise.reject(new Error(res.msg || res.message || "API Error"));
  }

  if (res && typeof res === "object" && Object.prototype.hasOwnProperty.call(res, "data")) {
    response.data = res.data;
  }

  return response;
}, (error) => {
  if (error?.response?.status === 401) {
    notifyUnauthorized(error?.config?.url);
  }
  return Promise.reject(error);
});

export default apiClient;
