import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const getApiBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  return envUrl || "";
};

export const getFileFallbackBaseURL = () => {
  const envUrl = import.meta.env.VITE_FILE_FALLBACK_BASE_URL;
  return envUrl || "";
};

const toOriginUrl = (baseURL: string, path: string) => {
  if (!baseURL) return "";
  if (!/^https?:\/\//i.test(baseURL)) return "";

  const { origin } = new URL(baseURL);
  return `${origin}${path}`;
};

export const resolveApiUrl = (path: string) => {
  const resolved = toOriginUrl(getApiBaseURL(), path);
  return resolved || path;
};

export const resolveFallbackApiUrl = (path: string) => {
  return toOriginUrl(getFileFallbackBaseURL(), path);
};

const apiClient = axios.create({
  baseURL: getApiBaseURL(),
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

apiClient.interceptors.response.use((response: AxiosResponse) => {
  const res = response.data;
  if (res.code && res.code !== "200") {
    return Promise.reject(new Error(res.msg || "API Error"));
  }
  return res.data;
});

export default apiClient;
