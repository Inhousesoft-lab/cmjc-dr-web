import { useAppSelector } from "@/app/hooks";
import i18n from "@/i18n/i18n";
import { JSX, ReactElement, useEffect, useMemo } from "react";
import { appBase } from "@/utils/appBase";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";

import { FALLBACK_LANG, detectBrowserLang, normalizeLang } from "./lang";

import AuthGuard from "@/routes/AuthGuard";
import MenuGate from "@/components/gate/MenuGate";
import { Menu } from "@/features/menu/MenuSlice";
import { getRuntimeMenuTree } from "@/features/menu/runtimeMenu";
import { ComponentKey, componentMap } from "./ComponentMap";
import { getDefaultLandingPath } from "./defaultLanding";
import Layout from "@/components/layout/Layout";

type LangElementProps = {
  byLang: Record<string, ComponentKey | null | undefined>;
};

function NotFoundRedirect() {
  const { lang } = useParams<{ lang?: string }>();
  const { list } = useAppSelector((s) => s.menuList);
  const normalized = normalizeLang(lang) ?? detectBrowserLang();

  return <Navigate to={getDefaultLandingPath(normalized, list)} replace />;
}

function DefaultLandingRedirect() {
  const { lang } = useParams<{ lang?: string }>();
  const { list } = useAppSelector((s) => s.menuList);
  const normalized = normalizeLang(lang) ?? detectBrowserLang();

  return <Navigate to={getDefaultLandingPath(normalized, list)} replace />;
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
  const urlLang = useMemo(() => normalizeLang(params.lang), [params.lang]);

  const { needsRedirect, redirectTo } = useMemo(() => {
    const pathname = location.pathname;
    const segs = pathname.split("/");
    const first = segs[1];
    const firstAsLang = normalizeLang(first);

    if (!first || (firstAsLang === null && first === "")) {
      const targetLang = detectBrowserLang();
      const rest = pathname === "/" ? "" : pathname;
      return { needsRedirect: true, redirectTo: `/${targetLang}${rest}` };
    }

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

  useEffect(() => {
    if (urlLang && i18n.language !== urlLang) {
      i18n.changeLanguage(urlLang);
    }
  }, [urlLang]);

  if (needsRedirect) {
    return (
      <Navigate
        to={`${redirectTo}${location.search}${location.hash}`}
        replace
      />
    );
  }

  if (params.lang && !urlLang) {
    const first = params.lang;
    const segs = location.pathname.split("/");

    if (/^[a-zA-Z]{2}(-[a-zA-Z]{2})?$/.test(first)) {
      segs[1] = FALLBACK_LANG;
      const fixed = segs.join("/");
      return (
        <Navigate to={`${fixed}${location.search}${location.hash}`} replace />
      );
    }

    const targetLang = detectBrowserLang();
    const fixed = `/${targetLang}${location.pathname}`;
    return (
      <Navigate to={`${fixed}${location.search}${location.hash}`} replace />
    );
  }

  return children;
};

export default function Router() {
  const { list } = useAppSelector((s) => s.menuList);
  const runtimeMenuTree = useMemo(() => getRuntimeMenuTree(list), [list]);
  const shouldHandleNotFound = runtimeMenuTree.length > 0;

  const renderRoutes = (routes: Menu[]): ReactElement[] => {
    return routes.flatMap((route) => {
      const result: ReactElement[] = [];

      if (route.element) {
        const koKey = route.element.ko;
        const enKey = route.element.en;
        const hasMappedComponent =
          (!!koKey && !!componentMap[koKey]) || (!!enKey && !!componentMap[enKey]);

        if (hasMappedComponent) {
          result.push(
            <Route
              key={`route-${route.path}`}
              path={`/:lang/${route.path}`}
              element={<LangElement byLang={route.element} />}
            />,
          );
        }
      }

      if (route.children && route.children.length > 0) {
        result.push(...renderRoutes(route.children));
      }

      return result;
    });
  };

  return (
    <BrowserRouter basename={appBase || undefined}> 
      <Routes>
        <Route
          path="/:lang/login"
          element={<LangElement byLang={{ ko: "Login", en: "Login" }} />}
        />
        <Route
          element={
            <AuthGuard>
              <MenuGate>
                <LangGuard>
                  <Layout />
                </LangGuard>
              </MenuGate>
            </AuthGuard>
          }
        >
          <Route
            index
            element={<Navigate to={`/${detectBrowserLang()}`} replace />}
          />
          <Route path="/:lang" element={<DefaultLandingRedirect />} />
          {renderRoutes(runtimeMenuTree)}
          <Route
            path="/:lang/*"
            element={shouldHandleNotFound ? <NotFoundRedirect /> : null}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
