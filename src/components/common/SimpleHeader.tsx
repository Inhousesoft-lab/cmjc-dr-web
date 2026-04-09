import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { requestLogout } from "@/features/auth/AuthSlice";
import { clearPostLoginRedirect } from "@/utils/authSession";
import { useTranslation } from "react-i18next";
import { getLangFromPathname } from "@/routes/lang";

export default function SimpleHeader() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);
  const [isNotifyOpen, setIsNotifyOpen] = React.useState(false);
  const lang = getLangFromPathname(location.pathname);

  const onLogout = React.useCallback(() => {
    clearPostLoginRedirect();
    dispatch(requestLogout()).finally(() => {
      navigate(`/${lang}/login`, { replace: true });
    });
  }, [dispatch, lang, navigate]);

  return (
    <div id="header">
      <div className="inner">
        <div className="util_group">
          <div className="user_info">
            <p className="user_name">
              <span>{user?.userNm ?? user?.userId ?? "-"}</span>
            </p>

            <p className="user-role">{(user?.roles ?? []).join(", ")}</p>

            <div
              className="notification"
              onMouseEnter={() => setIsNotifyOpen(true)}
              onMouseLeave={() => setIsNotifyOpen(false)}
            >
              <button className="btn_notify">
                <span className="ico_bell">
                  <span className="blind">알림</span>
                </span>
                <span className="notify_count">3</span>
              </button>
              <div
                className={`notify_box ${isNotifyOpen ? "is-open" : ""}`.trim()}
              >
                <p>새 알림 1</p>
                <p>새 알림 2</p>
                <p>새 알림 3</p>
              </div>
            </div>
            <button type="button" className="btn_logout" onClick={onLogout}>
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
