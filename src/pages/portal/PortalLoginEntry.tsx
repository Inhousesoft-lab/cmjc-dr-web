import { useAppDispatch } from "@/app/hooks";
import { portalLogin } from "@/features/auth/AuthSlice";
import { clearPostLoginRedirect } from "@/utils/authSession";
import { CSSProperties, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PortalLoginEntry() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const loginResult = await dispatch(portalLogin());

      if (cancelled) return;

      if (!portalLogin.fulfilled.match(loginResult)) {
        setError(loginResult.payload?.message ?? "포탈 로그인 처리에 실패했습니다.");
        return;
      }

      clearPostLoginRedirect();
      navigate(`/${lang ?? "ko"}`, { replace: true });
    };

    void run().catch(() => {
      if (cancelled) return;
      setError("포탈 로그인 처리 중 오류가 발생했습니다.");
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch, lang, navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <div style={styles.spinner} />
        <div style={styles.text}>
          {error || "내부망 포탈 토큰으로 로그인 처리 중입니다."}
        </div>
      </div>
    </div>
  );
}

const spinKeyframes = `
@keyframes portal-login-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

if (typeof document !== "undefined") {
  const styleId = "portal-login-spin-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = spinKeyframes;
    document.head.appendChild(style);
  }
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
    padding: 24,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "4px solid #dbe4f0",
    borderTopColor: "#2563eb",
    animation: "portal-login-spin 0.9s linear infinite",
  },
  text: {
    color: "#334155",
    fontSize: 15,
  },
};
