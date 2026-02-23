import i18n from "@/i18n/i18n";
import { JSX, ReactElement, useEffect, useMemo } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import { FALLBACK_LANG, detectBrowserLang, normalizeLang } from "./lang";

import { Menu } from "@/features/menu/MenuSlice";
import { ComponentKey, componentMap } from "./ComponentMap";
import Layout from "@/components/layout/Layout";

import menuItems from "./menuItems";
import AuthGuard from "./AuthGuard";

type LangElementProps = {
  byLang: Record<string, ComponentKey | null | undefined>;
};

function NotFoundRedirect() {
  const { lang } = useParams<{ lang?: string }>();
  const normalized = normalizeLang(lang) ?? detectBrowserLang();

  return <Navigate to={`/${normalized}/docClassification/list`} replace />;
}

function LangElement({ byLang }: LangElementProps) {
  const { lang } = useParams<{ lang: string }>();
  const normalized = normalizeLang(lang) ?? FALLBACK_LANG;

  const componentKey = byLang[normalized] ?? byLang[FALLBACK_LANG];
  if (!componentKey) return <NotFoundRedirect />;

  const Component = componentMap[componentKey];
  if (!Component) return <NotFoundRedirect />;

  return <Component />;
}

const LangGuard = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const params = useParams<{ lang?: string }>();

  // 1) URL에 lang가 “있는지” (/:lang/* 라우트로 들어온 경우)
  const urlLang = useMemo(() => normalizeLang(params.lang), [params.lang]);

  // 2) URL에 lang가 없는 경우를 감지하기 위해 pathname 직접 파싱
  const { needsRedirect, redirectTo } = useMemo(() => {
    const pathname = location.pathname; // 예: "/home", "/en/home", "/xx/home"
    const segs = pathname.split("/"); // ["", "home"] or ["", "en", "home"]

    const first = segs[1]; // 첫 segment
    const firstAsLang = normalizeLang(first);

    // (A) lang이 아예 없다: "/home" "/settings" "/"
    if (!first || (firstAsLang === null && first === "") /* 루트 */) {
      const targetLang = detectBrowserLang(); // 브라우저 기반 (또는 fallback)
      const rest = pathname === "/" ? "" : pathname; // "/"면 뒤에 아무 것도 없음
      return { needsRedirect: true, redirectTo: `/${targetLang}${rest}` };
    }

    // (B) 첫 segment가 지원하지 않는 lang처럼 생김: "/xx/home"
    // - 이 경우를 "lang이 잘못됨"으로 보고 브라우저/폴백으로 교체
    // - 단, "xx"가 실제 페이지 세그먼트일 수도 있잖아? 라고 걱정되면
    //   '지원 언어 패턴(2글자)' 같은 조건을 더 붙여도 됨.
    if (
      first &&
      normalizeLang(first) === null &&
      /^[a-zA-Z]{2}(-[a-zA-Z]{2})?$/.test(first)
    ) {
      const targetLang = detectBrowserLang();
      segs[1] = targetLang;
      return { needsRedirect: true, redirectTo: segs.join("/") };
    }

    return { needsRedirect: false, redirectTo: "" };
  }, [location.pathname]);

  // 3) URL에 유효한 lang가 있으면 i18n과 동기화
  useEffect(() => {
    if (urlLang && i18n.language !== urlLang) {
      i18n.changeLanguage(urlLang);
    }
  }, [urlLang]);

  if (needsRedirect) {
    // querystring, hash 유지
    return (
      <Navigate
        to={`${redirectTo}${location.search}${location.hash}`}
        replace
      />
    );
  }

  // 개선: params.lang가 있는데 지원 lang가 아니면
  // 1) "dur" 같은 일반 세그먼트를 lang로 오해한 경우 => lang를 "앞에 붙여서" 보정
  // 2) 진짜 "xx" 같은 잘못된 lang(2글자 패턴) => 기존처럼 교체
  if (params.lang && !urlLang) {
    const first = params.lang;

    // 진짜 lang처럼 보이는(2글자) 잘못된 값이면 교체
    if (/^[a-zA-Z]{2}(-[a-zA-Z]{2})?$/.test(first)) {
      const segs = location.pathname.split("/");
      segs[1] = FALLBACK_LANG;
      const fixed = segs.join("/");
      return (
        <Navigate to={`${fixed}${location.search}${location.hash}`} replace />
      );
    }

    // 그 외는 "lang 누락"으로 보고 앞에 추가 - ex) /dur/proposal → /{targetLang}/dur/proposal 로 정확히 보정
    const targetLang = detectBrowserLang();
    const fixed = `/${targetLang}${location.pathname}`;
    const segs = location.pathname.split("/");
    return (
      <Navigate to={`${fixed}${location.search}${location.hash}`} replace />
    );
  }

  return children;
};

export default function Router() {
  const renderRoutes = (routes: Menu[]): ReactElement[] => {
    return routes.flatMap((route) => {
      const result: ReactElement[] = [];

      // 1️⃣ 자기 자신이 라우터인 경우
      if (route.element) {
        result.push(
          <Route
            key={`route-${route.path}`}
            path={`/:lang/${route.path}`}
            element={<LangElement byLang={route.element} />}
          />,
        );
      }

      // 2️⃣ 자식이 있으면 재귀
      if (route.children && route.children.length > 0) {
        result.push(...renderRoutes(route.children));
      }

      return result;
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/:lang/login"
          element={<LangElement byLang={{ ko: "Login", en: "Login" }} />}
        />
        {/* 공통 레이아웃 */}
        <Route
          element={
            <AuthGuard>
              <LangGuard>
                <Layout />
              </LangGuard>
            </AuthGuard>
          }
        >
          {/* ✅ 루트(/)로 들어오면 브라우저 언어 기반으로 /ko 또는 /en로 보내기 */}
          <Route
            index
            element={<Navigate to={`/${detectBrowserLang()}`} replace />}
          />

          {renderRoutes(menuItems)}
          {/* lang 포함 NotFound */}
          <Route path="/:lang/*" element={<NotFoundRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
