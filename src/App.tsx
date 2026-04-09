import * as React from "react";
import { persistor } from "@/app/store";
import { useAppDispatch } from "@/app/hooks";
import { checkSession, requestLogout } from "@/features/auth/AuthSlice";
import Router from "@/routes/Router";
import { getLangFromPathname } from "@/routes/lang";
import { https } from "@shared/utils/https";
import {
  beginUnauthorizedRedirect,
  resetUnauthorizedFlag,
  setPostLoginRedirect,
  isLoginPath,
  UNAUTHORIZED_EVENT_NAME,
} from "@/utils/authSession";
import { withAppBase } from "@/utils/appBase";

import NotificationsProvider from "@/hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "@/hooks/useDialogs/DialogsProvider";

import AppTheme from "./theme/AppTheme";
import UseLangStylesReady from "./UseLangStylesReady";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

export default function App() {
  const dispatch = useAppDispatch();
  const ready = UseLangStylesReady();

  React.useEffect(() => {
    const isLoginPage = isLoginPath(window.location.pathname);
    if (isLoginPage) return;
    dispatch(checkSession());
  }, [dispatch]);

  React.useEffect(() => {
    const interceptorId = https.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          console.warn("[auth] 401 received", error?.config?.url);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      https.interceptors.response.eject(interceptorId);
    };
  }, []);

  React.useEffect(() => {
    const handleUnauthorized = async () => {
      if (!beginUnauthorizedRedirect()) return;

      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const lang = getLangFromPathname(window.location.pathname);

      await dispatch(requestLogout());
      await persistor.purge();
      setPostLoginRedirect(currentPath);
      window.location.replace(withAppBase(`/${lang}/login`));
    };

    window.addEventListener(UNAUTHORIZED_EVENT_NAME, handleUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT_NAME, handleUnauthorized);
      resetUnauthorizedFlag();
    };
  }, [dispatch]);

  if (!ready) {
    return null;
  }

  return (
    <AppTheme>
      <NotificationsProvider>
        <DialogsProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Router />
          </LocalizationProvider>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
