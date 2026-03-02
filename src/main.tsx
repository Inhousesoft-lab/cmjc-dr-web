import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/app/store";

import { FALLBACK_LANG, normalizeLang } from "./routes/lang";
import { LOCALE_KEY } from "./i18n/i18n";
import "./i18n/i18n"; /* first load */

import App from "./App";

import "@fortawesome/fontawesome-free/css/all.min.css";

import dayjs from "dayjs";
import "dayjs/locale/ko";

import "./utils/globalFunc";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element (#root) not found");
}

function resolveInitialLang() {
  const saved = localStorage.getItem(LOCALE_KEY);
  return (
    normalizeLang(saved) ?? normalizeLang(navigator.language) ?? FALLBACK_LANG
  );
}

// ✅ ReactDOM.render 이전에 실행
const lang = resolveInitialLang();

if (window.location.pathname === "/") {
  window.history.replaceState(
    null,
    "",
    `/${lang}${window.location.search}${window.location.hash}`,
  );
}

dayjs.locale("ko"); // 전역 로케일을 한국으로 설정

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
