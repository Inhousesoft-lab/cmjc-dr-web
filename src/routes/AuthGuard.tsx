import { useAppSelector } from "@/app/hooks";
import { setPostLoginRedirect } from "@/utils/authSession";
import { JSX } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { isAuthenticated, sessionChecking, initialized } = useAppSelector(
    (s) => s.auth,
  );
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();

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

  return children;
}
