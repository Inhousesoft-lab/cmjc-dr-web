import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosRequestConfig<D = unknown> {
    skipGlobalLoading?: boolean;
  }
}

type GlobalApiLoadingListener = (isLoading: boolean) => void;

const SHOW_DELAY_MS = 200;
const trackedRequests = new WeakSet<object>();
const listeners = new Set<GlobalApiLoadingListener>();

let activeRequestCount = 0;
let showTimer: ReturnType<typeof setTimeout> | null = null;
let loadingVisible = false;

const notifyListeners = () => {
  listeners.forEach((listener) => listener(loadingVisible));
};

const setLoadingVisible = (isVisible: boolean) => {
  if (loadingVisible === isVisible) return;
  loadingVisible = isVisible;
  notifyListeners();
};

const clearShowTimer = () => {
  if (!showTimer) return;
  clearTimeout(showTimer);
  showTimer = null;
};

const shouldSkipLoading = (config?: InternalAxiosRequestConfig | null) =>
  Boolean(config?.skipGlobalLoading);

export const subscribeGlobalApiLoading = (
  listener: GlobalApiLoadingListener,
) => {
  listeners.add(listener);
  listener(loadingVisible);

  return () => {
    listeners.delete(listener);
  };
};

const beginGlobalApiLoading = (config: InternalAxiosRequestConfig) => {
  if (shouldSkipLoading(config) || trackedRequests.has(config)) {
    return;
  }

  trackedRequests.add(config);
  activeRequestCount += 1;

  if (activeRequestCount === 1 && !loadingVisible && !showTimer) {
    showTimer = setTimeout(() => {
      showTimer = null;
      if (activeRequestCount > 0) {
        setLoadingVisible(true);
      }
    }, SHOW_DELAY_MS);
  }
};

const endGlobalApiLoading = (config?: InternalAxiosRequestConfig | null) => {
  if (!config || !trackedRequests.has(config)) {
    return;
  }

  trackedRequests.delete(config);

  activeRequestCount = Math.max(0, activeRequestCount - 1);

  if (activeRequestCount > 0) {
    return;
  }

  clearShowTimer();
  setLoadingVisible(false);
};

const getErrorConfig = (error: unknown) =>
  (error as { config?: InternalAxiosRequestConfig } | null)?.config;

export const trackGlobalApiRequest = (config: InternalAxiosRequestConfig) => {
  beginGlobalApiLoading(config);
  return config;
};

export const untrackGlobalApiResponse = <T>(response: AxiosResponse<T>) => {
  endGlobalApiLoading(response.config);
  return response;
};

export const untrackGlobalApiError = (error: unknown) => {
  endGlobalApiLoading(getErrorConfig(error));
  return Promise.reject(error);
};
