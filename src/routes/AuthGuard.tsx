import { useAppSelector } from "@/app/hooks";
import { shouldForcePasswordChange } from "@/features/auth/authAccess";
import { setPostLoginRedirect } from "@/utils/authSession";
import { JSX } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { isAuthenticated, sessionChecking, initialized } = useAppSelector(
    (s) => s.auth,
  );
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const isPasswordChangePath = /\/password-change\/?$/.test(location.pathname);

  if (sessionChecking || !initialized) return null;

  if (!isAuthenticated) {
    setPostLoginRedirect(
      `${location.pathname}${location.search}${location.hash}`,
    );

    return (
      <Navigate
        to={`/${lang ?? "ko"}/login`}
        replace
        state={{ from: location }}
      />
    );
  }

  if (shouldForcePasswordChange(user) && !isPasswordChangePath) {
    return <Navigate to={`/${lang ?? "ko"}/password-change`} replace />;
  }

  return children;
}
