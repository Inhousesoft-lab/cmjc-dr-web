import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { login } from "@/features/auth/AuthSlice";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const { loading } = useAppSelector((s) => s.auth);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fallbackPath = `/${lang ?? "ko"}/docClassification/list`;
  const fromPath = (location.state as any)?.from?.pathname;
  const storedRedirect = sessionStorage.getItem("postLoginRedirect");
  const storedPath =
    storedRedirect && !storedRedirect.endsWith("/login")
      ? storedRedirect
      : null;
  const targetPath =
    fromPath && !fromPath.endsWith("/login")
      ? fromPath
      : storedPath || fallbackPath;

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
      sessionStorage.removeItem("postLoginRedirect");
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

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
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
