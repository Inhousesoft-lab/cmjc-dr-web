import { useEffect, useRef, useState } from "react";
import i18n from "@/i18n/i18n";

function normalize(lang?: string) {
  const base = (lang ?? "ko").toLowerCase().split("-")[0];
  return base === "en" ? "en" : "ko";
}

export default function UseLangStylesReady() {
  const [ready, setReady] = useState(false);
  const loaded = useRef(new Set<string>());

  useEffect(() => {
    const lang = normalize(i18n.language);

    // html lang도 같이 변경
    document.documentElement.lang = lang;

    // 이미 로드했으면 다시 import 하지 않음
    if (loaded.current.has(lang)) {
      setReady(true);
      return;
    }

    setReady(false);

    // ✅ 언어별 scss 동적 로드
    const p =
      lang === "en"
        ? import("@/styles/main.ko.scss")
        : import("@/styles/main.ko.scss");

    p.then(() => {
      loaded.current.add(lang);
      setReady(true);
    });
  }, [i18n.language]);

  console.log(
    "UseLangStylesReady i18n.language=" + i18n.language + ", ready=" + ready,
  );

  return ready;
}
