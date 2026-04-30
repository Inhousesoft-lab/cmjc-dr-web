import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { requestLogout } from "@/features/auth/AuthSlice";
import { clearPostLoginRedirect } from "@/utils/authSession";
import { useTranslation } from "react-i18next";
import { getLangFromPathname, langPath } from "@/routes/lang";
import { isDrAdminUser } from "@/features/auth/authAccess";

export default function SimpleHeader() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const lang = getLangFromPathname(location.pathname);
  const isAdmin = isDrAdminUser(user);
  const deptName = user?.deptNm ?? user?.instNm ?? "";
  const userName = user?.userNm ?? user?.userId ?? "-";

  const onLogout = React.useCallback(() => {
    clearPostLoginRedirect();
    dispatch(requestLogout()).finally(() => {
      navigate(`/${lang}/login`, { replace: true });
    });
  }, [dispatch, lang, navigate]);

  const onMemberManagement = React.useCallback(() => {
    navigate(langPath("members", lang));
  }, [lang, navigate]);

  const onPasswordChange = React.useCallback(() => {
    navigate(langPath("password-change", lang));
  }, [lang, navigate]);

  return (
    <div id="header">
      <div className="inner">
        <div className="util_group">
          <div className="user_info">
            <p className="user_name">
              {deptName ? <span className="user_dept">({deptName})</span> : null}
              <span>{userName}</span>
            </p>
            {isAdmin ? (
              <button
                type="button"
                className="btn_member_manage"
                onClick={onMemberManagement}
              >
                회원관리
              </button>
            ) : (
              <button
                type="button"
                className="btn_password_change"
                onClick={onPasswordChange}
              >
                비밀번호 변경
              </button>
            )}
            <button type="button" className="btn_logout" onClick={onLogout}>
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
