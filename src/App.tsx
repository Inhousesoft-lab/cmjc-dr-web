import * as React from "react";
import { useAppDispatch } from "@/app/hooks";
import { checkSession, logout } from "@/features/auth/AuthSlice";
import Router from "@/routes/Router";
import { https } from "@shared/utils/https";

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
    dispatch(checkSession());
  }, [dispatch]);

  React.useEffect(() => {
    const interceptorId = https.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          dispatch(logout());
        }
        return Promise.reject(error);
      },
    );

    return () => {
      https.interceptors.response.eject(interceptorId);
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
