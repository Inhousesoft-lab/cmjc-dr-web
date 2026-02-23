import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function MenuGate({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((s) => s.menu);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    async function ensureMenus() {
      // 이미 persist로 메뉴가 들어와 있으면 바로 통과
      if (list && list.length > 0) {
        alive && setReady(true);
        return;
      }

      try {
        // thunk 완료까지 기다림 (unwrap 사용 가능하면 더 좋음)
        //await dispatch(selectMenuList({ langSeCd: i18n.language })).unwrap?.();
      } catch (e) {
        // 실패해도 앱이 아예 안 뜨면 곤란하니,
        // 여기서 정책을 정하세요:
        //  - ready를 true로 해서 fallback 메뉴/빈 메뉴로 진행
        //  - 혹은 에러 화면을 띄우기
      } finally {
        alive && setReady(true);
      }
    }

    ensureMenus();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 앱 최초 1회

  if (!ready || loading) return <>{fallback}</>;
  return <>{children}</>;
}
