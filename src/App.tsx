import * as React from "react";
import { persistor } from "@/app/store";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { checkSession, requestLogout } from "@/features/auth/AuthSlice";
import Router from "@/routes/Router";
import { getLangFromPathname } from "@/routes/lang";
import {
  beginUnauthorizedRedirect,
  resetUnauthorizedFlag,
  setPostLoginRedirect,
  UNAUTHORIZED_EVENT_NAME,
} from "@/utils/authSession";
import { withAppBase } from "@/utils/appBase";

import NotificationsProvider from "@/hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "@/hooks/useDialogs/DialogsProvider";
import GlobalLoadingIndicator from "@/components/common/GlobalLoadingIndicator";

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
  const { initialized } = useAppSelector((s) => s.auth);

  React.useEffect(() => {
    if (initialized) return;
    void dispatch(checkSession());
  }, [dispatch, initialized]);

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
      <GlobalLoadingIndicator />
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
