import React from "react";
import { Alert, Button, Stack, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import https from "@/api/axiosInstance";
import { changePasswordApiPath } from "@/api/auth/PasswordApiPaths";
import { getLangFromPathname } from "@/routes/lang";
import useNotifications from "@/hooks/useNotifications";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { markPasswordChanged } from "@/features/auth/AuthSlice";
import { shouldForcePasswordChange } from "@/features/auth/authAccess";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const INITIAL_FORM: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function PasswordChange() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useNotifications();
  const lang = getLangFromPathname(location.pathname);
  const user = useAppSelector((state) => state.auth.user);
  const isForced = shouldForcePasswordChange(user);
  const [values, setValues] = React.useState<PasswordForm>(INITIAL_FORM);
  const [submitting, setSubmitting] = React.useState(false);

  const handleChange =
    (name: keyof PasswordForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [name]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentPassword = values.currentPassword.trim();
    const newPassword = values.newPassword.trim();
    const confirmPassword = values.confirmPassword.trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      notifications.show("비밀번호를 모두 입력해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    if (newPassword.length < 8) {
      notifications.show("새 비밀번호는 8자 이상 입력해 주세요.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      notifications.show("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.", {
        severity: "warning",
        autoHideDuration: 2500,
      });
      return;
    }

    setSubmitting(true);
    try {
      await https.post(changePasswordApiPath(), {
        currentPassword,
        newPassword,
      });
      notifications.show("비밀번호가 변경되었습니다.", {
        severity: "success",
        autoHideDuration: 2500,
      });
      dispatch(markPasswordChanged());
      navigate(`/${lang}/digitalDoc/list`, { replace: true });
    } catch (error) {
      notifications.show(getErrorMessage(error), {
        severity: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="password-change">
      <form className="password-change__form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {isForced && (
            <Alert severity="warning">
              최초 로그인 시에는 비밀번호 변경 후 서비스를 이용할 수 있습니다.
            </Alert>
          )}
          <TextField
            label="현재 비밀번호"
            type="password"
            value={values.currentPassword}
            onChange={handleChange("currentPassword")}
            autoComplete="current-password"
          />
          <TextField
            label="새 비밀번호"
            type="password"
            value={values.newPassword}
            onChange={handleChange("newPassword")}
            autoComplete="new-password"
          />
          <TextField
            label="새 비밀번호 확인"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            autoComplete="new-password"
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {!isForced && (
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                취소
              </Button>
            )}
            <Button type="submit" variant="contained" disabled={submitting}>
              변경
            </Button>
          </Stack>
        </Stack>
      </form>
    </div>
  );
}
