import { useAppSelector } from "@/app/hooks";
import { JSX } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

export default function AuthGuard({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();

  if (loading) return null;

  if (!isAuthenticated) {
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
