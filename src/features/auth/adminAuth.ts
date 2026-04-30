import { DR_ADMIN_AUTH_API } from "@/features/auth/authApi";

export const getDrAdminAuthConfig = () => ({
  loginPath: DR_ADMIN_AUTH_API.login,
  mePath: DR_ADMIN_AUTH_API.me,
  extendPath: DR_ADMIN_AUTH_API.extend,
  logoutPath: DR_ADMIN_AUTH_API.logout,
});
