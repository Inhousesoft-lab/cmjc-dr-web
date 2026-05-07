import { SafeError } from "@/features/com/Api";
import { notifyUnauthorized } from "@/utils/authSession";
import { setDrMenuUrlHeader } from "@/utils/drMenuUrl";
import axios, { AxiosInstance } from "axios";

/**
 * 공통 axios 인스턴스
 * DR 프론트는 기본적으로 DR backend(`/api/dr/...`)를 호출하고,
 * 관리자 인증 세션은 backend에서 PP 공통 admin API
 * (`/api/pp/adminLogin`, `/api/pp/adminSessionCheck`, `/api/pp/adminExtend`, `/api/pp/adminLogout`)
 * 로 연계된다.
 *
 * API base URL
 *
 * 기본값은 루트(`/`)다. 각 호출 경로가 이미 `/api/...` 절대경로를 포함하므로
 * Vite dev proxy / nginx / same-origin 배포에서는 그대로 두는 편이 안전하다.
 *
 * `VITE_API_BASE_URL`은 필요할 때만 사용한다.
 * - 상대경로 예: `/`
 * - 절대 오리진 예: `https://example.com`
 *
 * `/api`를 baseURL로 넣으면 `/api/dr/...` 호출이 `/api/api/dr/...`로 중복될 수 있다.
 */
const normalizeApiBaseURL = (value?: string) => {
  const normalized = String(value ?? "").trim();

  if (!normalized || normalized === "/api" || normalized === "/api/") {
    return "/";
  }

  return normalized;
};

const apiBaseURL = normalizeApiBaseURL(import.meta.env.VITE_API_BASE_URL);

const https: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  // DR admin auth is session-cookie based, so cross-origin dev setups
  // still need credential forwarding.
  // Any-ID 로그인은 서버 세션을 사용하므로(기본 샘플과 동일),
  // 개발 환경처럼 API와 UI 오리진이 다를 때 쿠키 전송을 위해 필요
  withCredentials: true,
});

https.interceptors.request.use((config) => {
  setDrMenuUrlHeader(config.headers);
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// 📥 Response Interceptor 추가 (에러 메시지 자동화)
https.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      console.warn("[https] auth error", {
        status,
        url: error?.config?.url,
      });
    }
    if (status === 401) {
      notifyUnauthorized(error?.config?.url);
    }

    const data = error.response?.data;
    const message =
      data?.message ||
      data?.result?.errors?.message ||
      data?.errors?.message ||
      error.message ||
      "알 수 없는 오류";

    (error as SafeError).displayMessage = message;
    console.error("🚫 API Error:", message);

    return Promise.reject(error);
  },
);

export { https };
