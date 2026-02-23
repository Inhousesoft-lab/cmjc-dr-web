interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_APP_BASE?: string
  readonly VITE_APP_EGOV_CONTEXT_URL?: string
  readonly VITE_ANY_ID_STATIC_URL?: string
  readonly VITE_PROXY_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
