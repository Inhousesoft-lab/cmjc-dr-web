import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getMenuList } from "@/features/menu/MenuThunk";

export default function MenuGate({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { list, loading } = useAppSelector((s) => s.menuList);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    async function ensureMenus() {
      if (!isAuthenticated) {
        alive && setReady(true);
        return;
      }

      if (list.length > 0) {
        alive && setReady(true);
        return;
      }

      try {
        await dispatch(getMenuList()).unwrap();
      } catch {
        // Allow rendering even when menu fetch fails; router handles empty state.
      } finally {
        alive && setReady(true);
      }
    }

    ensureMenus();

    return () => {
      alive = false;
    };
  }, [dispatch, isAuthenticated, list]);

  if (!ready || loading) return <>{fallback}</>;
  return <>{children}</>;
}
