import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "@/features/auth/AuthSlice";
import { shouldForcePasswordChange } from "@/features/auth/authAccess";
import { clearPostLoginRedirect } from "@/utils/authSession";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { loginSubmitting, isAuthenticated, initialized } = useAppSelector(
    (s) => s.auth,
  );
  const user = useAppSelector((s) => s.auth.user);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const currentLang = lang ?? "ko";
  const documentListPath = `/${currentLang}/digitalDoc/list`;
  const passwordChangePath = `/${currentLang}/password-change`;

  useEffect(() => {
    if (!initialized || !isAuthenticated) {
      return;
    }

    clearPostLoginRedirect();
    navigate(
      shouldForcePasswordChange(user) ? passwordChangePath : documentListPath,
      { replace: true },
    );
  }, [
    initialized,
    isAuthenticated,
    documentListPath,
    navigate,
    passwordChangePath,
    user,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmedId = id.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      setErrorMsg("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    const result = await dispatch(
      login({ userId: trimmedId, password: trimmedPassword }),
    );

    if (login.fulfilled.match(result)) {
      clearPostLoginRedirect();
      navigate(
        shouldForcePasswordChange(result.payload)
          ? passwordChangePath
          : documentListPath,
        { replace: true },
      );
      return;
    }

    setErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>로그인</h2>

        <label style={styles.label}>아이디</label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={styles.input}
          placeholder="아이디를 입력하세요"
          autoComplete="username"
        />

        <label style={styles.label}>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
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
  title: {
    margin: 0,
    marginBottom: 16,
    fontSize: 22,
  },
  label: {
    display: "block",
    marginTop: 12,
    marginBottom: 4,
    fontWeight: 600,
  },
  input: {
    boxSizing: "border-box",
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
