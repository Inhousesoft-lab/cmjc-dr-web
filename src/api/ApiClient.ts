import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * API Base URL 환경 변수에서 가져오기
 * VITE_API_BASE_URL이 'http://localhost:8080/api' 형식이면 '/api'를 제거하여 base URL만 사용
 */
const getApiBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    // return envUrl.endsWith('/api') ? envUrl.replace('/api', '') : envUrl;
      return envUrl; 
  }
};

const apiClient = axios.create({
  baseURL: getApiBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터: FormData인 경우 Content-Type 헤더 제거
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // FormData인 경우 Content-Type을 제거하여 axios가 자동으로 multipart/form-data로 설정하도록 함
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// 응답 인터셉터: 데이터 구조 단순화 및 공통 에러 처리
apiClient.interceptors.response.use((response: AxiosResponse) => {
  const res = response.data;
  // 서버 약속: code가 "0"이 아니면 에러로 간주
  if (res.code && res.code !== "200") {
    return Promise.reject(new Error(res.msg || 'API Error'));
  }
  return res.data; // data 필드만 바로 반환
});

export default apiClient;