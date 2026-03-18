import { SafeError } from "@/features/com/Api";
import axios, { AxiosInstance } from "axios";

/**
 * 공통 axios 인스턴스
 * API base URL
 *
 * - development: '/api' (handled by Vite dev-server proxy)
 *   http://localhost:8080/pp/api
 *
 * - production : '/api' (handled by infra/nginx)
 *   https://www.drugsafe.or.kr/api
 *
 * NEVER put full origin here.
 */
const apiBaseURL = import.meta.env.VITE_API_BASE_URL ?? "/";

const https: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  // Any-ID 로그인은 서버 세션을 사용하므로(기본 샘플과 동일),
  // 개발 환경처럼 API와 UI 오리진이 다를 때 쿠키 전송을 위해 필요
  withCredentials: true,
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

