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
const apiBaseURL = import.meta.env.VITE_API_BASE_URL ?? "";

const https: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  // Any-ID 로그인은 서버 세션을 사용하므로(기본 샘플과 동일),
  // 개발 환경처럼 API와 UI 오리진이 다를 때 쿠키 전송을 위해 필요
  withCredentials: true,
});

// ✅ 모든 요청에 locale 헤더 자동 주입
https.interceptors.request.use((config) => {
  const lang = (i18n.language || "ko").startsWith("en") ? "en" : "ko";

  config.headers = config.headers ?? {};
  // 서버가 요구하는 헤더명에 맞춰 선택:
  config.headers["Accept-Language"] = lang;
  // config.headers['X-Locale'] = lang // 필요하면 둘 다

  return config;
});

https.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export { https };
