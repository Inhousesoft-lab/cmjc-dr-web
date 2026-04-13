import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "@/features/auth/AuthSlice";
import {
  clearPostLoginRedirect,
  canUsePostLoginRedirect,
  getPostLoginRedirect,
} from "@/utils/authSession";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getDefaultLandingPath } from "@/routes/defaultLanding";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const { loginSubmitting, isAuthenticated, initialized } = useAppSelector(
    (s) => s.auth,
  );
  const { list, loaded: menuLoaded, loading: menuLoading } = useAppSelector(
    (s) => s.menuList,
  );

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fallbackPath =
    list.length > 0 ? getDefaultLandingPath(lang, list) : `/${lang ?? "ko"}`;
  const fromPath = (location.state as any)?.from?.pathname;
  const storedPath = getPostLoginRedirect();
  const targetPath =
    canUsePostLoginRedirect(fromPath)
      ? fromPath
      : storedPath || fallbackPath;

  useEffect(() => {
    if (!initialized || !isAuthenticated) {
      return;
    }

    if (!menuLoaded && menuLoading) {
      return;
    }

    clearPostLoginRedirect();
    navigate(targetPath, { replace: true });
  }, [
    initialized,
    isAuthenticated,
    menuLoaded,
    menuLoading,
    navigate,
    targetPath,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedId = id.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      setErrorMsg("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const result = await dispatch(
      login({ userId: trimmedId, password: trimmedPassword }),
    );

    if (login.fulfilled.match(result)) {
      clearPostLoginRedirect();
      navigate(targetPath, { replace: true });
    } else {
      setErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>로그인</h2>

        <label style={styles.label}>아이디</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={styles.input}
          placeholder="아이디를 입력하세요"
        />

        <label style={styles.label}>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          placeholder="비밀번호를 입력하세요"
        />

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        <button type="submit" style={styles.button} disabled={loginSubmitting}>
          {loginSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  form: {
    width: 320,
    padding: 24,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  label: {
    display: "block",
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    fontSize: 14,
  },
  button: {
    marginTop: 20,
    width: "100%",
    padding: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: 10,
    fontSize: 13,
  },
};
