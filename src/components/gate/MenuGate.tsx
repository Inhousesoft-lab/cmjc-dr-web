import React from "react";
import { useAppSelector } from "@/app/hooks";

export default function MenuGate({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { loading, loaded } = useAppSelector((s) => s.menuList);

  if (isAuthenticated && (loading || !loaded)) return <>{fallback}</>;
  return <>{children}</>;
}
