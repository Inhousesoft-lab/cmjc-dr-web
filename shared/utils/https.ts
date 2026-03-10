import { SafeError } from "@/features/com/Api";
import { withAppBase } from "@/utils/appBase";
import axios, { AxiosInstance } from "axios";
import i18n from "@/i18n/i18n";

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
  (response) => response, // 성공 응답 그대로

  (error) => {
    // TODO 개발시 추가 항목 세션 끊어질시 로그인화면으로 전환처리 start
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            "postLoginRedirect",
            `${window.location.pathname}${window.location.search}`,
          );
          sessionStorage.removeItem("persist:root");
        } catch {
          // ignore storage errors
        }
        const lang = (i18n.language || "ko").startsWith("en") ? "en" : "ko";
        const loginPath = withAppBase(`/${lang}/login`);
        if (!window.location.pathname.startsWith(loginPath)) {
          window.location.href = loginPath;
        }
      }
    }
    // end

    // 에러 메시지 자동 추출 (여러 경로 지원)
    const data = error.response?.data;
    const message =
      data?.message ||
      data?.result?.errors?.message ||
      data?.errors?.message ||
      error.message ||
      "알 수 없는 오류";

    // 에러 객체에 displayMessage 추가
    (error as SafeError).displayMessage = message;
    console.error("🚫 API Error:", message);

    return Promise.reject(error);
  },
);
 
export { https };

