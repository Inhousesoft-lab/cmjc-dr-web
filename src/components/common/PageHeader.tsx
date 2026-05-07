import React from "react";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { Menu } from "@/features/menu/MenuSlice";
import { getRuntimeMenuTree, joinPath, normalizePath } from "@/features/menu/runtimeMenu";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { stripAppBase } from "@/utils/appBase";
import { getLangFromPathname } from "@/routes/lang";
import { getDefaultLandingPath } from "@/routes/defaultLanding";

interface PageHeaderProps {
  children?: React.ReactNode;
}

type BreadcrumbItem = {
  path?: string;
  label?: string;
  hasPage: boolean;
};

export default function PageHeader({ children }: PageHeaderProps) {
  const { pathname } = useLocation();
  const normalizedLocationPath = stripAppBase(pathname);
  const lang = getLangFromPathname(pathname);
  const normalizedPath = normalizePath(
    normalizedLocationPath.replace(/^\/(ko|en|ja|zh)(\/|$)/, ""),
  );
  const currentPath = `/${normalizedPath}`;

  const findBreadcrumbs = (
    routes: Menu[],
    parentPath = "",
  ): BreadcrumbItem[] | null => {
    for (const route of routes) {
      const fullPath = joinPath(parentPath, route.path);
      const directPath = normalizePath(route.path);
      const routePath = directPath || fullPath;
      const routePattern = routePath ? `/${routePath}` : "";
      const isMatched =
        !!routePath &&
        !!matchPath({ path: routePattern, end: false }, currentPath);
      const isExactMatched =
        !!routePath &&
        !!matchPath({ path: routePattern, end: true }, currentPath);

      const current: BreadcrumbItem[] = route.label
        ? [
            {
              path: routePath,
              label: route.label,
              hasPage: !!route.element,
            },
          ]
        : [];

      if (isMatched && route.children?.length) {
        const childResult = findBreadcrumbs(route.children, fullPath);
        if (childResult) {
          return [...current, ...childResult];
        }
      }

      if (isExactMatched) {
        if (route.children?.length) {
          const childResult = findBreadcrumbs(route.children, fullPath);
          if (childResult) {
            return [...current, ...childResult];
          }
        }

        return current;
      }

      if (route.children?.length) {
        const childOnlyResult = findBreadcrumbs(route.children, fullPath);
        if (childOnlyResult) {
          return [...current, ...childOnlyResult];
        }
      }
    }

    return null;
  };

  const { list } = useAppSelector((s) => s.menuList);
  const user = useAppSelector((s) => s.auth.user);
  const runtimeMenuTree = React.useMemo(
    () => getRuntimeMenuTree(list, user),
    [list, user],
  );
  const homePath = getDefaultLandingPath(lang, list, user);
  const breadcrumbs = findBreadcrumbs(runtimeMenuTree) ?? [];
  const pageTitle =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : "Home";

  return (
    <div className="content_wrap">
      <div className="location">
        <div className="page_path">
          <h2 className="tit">{pageTitle}</h2>
        </div>

        <div className="local">
          <Breadcrumbs
            separator={<NavigateNextIcon className="breadcrumbs_icon" />}
            className="breadcrumbs"
          >
            <Link
              component={NavLink}
              to={homePath}
              className="home_icon"
            >
              <span className="home">
                <span className="blind">홈</span>
              </span>
            </Link>

            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const key = item.path ?? `${item.label}-${index}`;

              return isLast || !item.hasPage ? (
                <Typography key={key} className="route_text">
                  {item.label}
                </Typography>
              ) : (
                <Link
                  key={key}
                  component={NavLink}
                  to={`/${lang}/${item.path}`}
                  className="current_text"
                >
                  {item.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        </div>
      </div>

      <div className="content">{children}</div>
    </div>
  );
}
