// DR frontend calls DR auth endpoints, and the backend maps these to
// the PP common admin auth API flow.
export const DR_ADMIN_AUTH_API = {
  login: "/api/dr/auth/login",
  tokenLogin: "/api/dr/auth/token-login",
  // Canonical DR auth/session endpoint used by the frontend.
  me: "/api/dr/auth/me",
  // Legacy naming kept only as a frontend alias so older call sites do not drift
  // back to the backend's deprecated /api/dr/auth/session-check route.
  sessionCheck: "/api/dr/auth/me",
  extend: "/api/dr/auth/extend",
  logout: "/api/dr/auth/logout",
} as const;

export const PP_COMMON_ADMIN_AUTH_API = {
  login: "/api/pp/adminLogin",
  sessionCheck: "/api/pp/adminSessionCheck",
  extend: "/api/pp/adminExtend",
  logout: "/api/pp/adminLogout",
} as const;
