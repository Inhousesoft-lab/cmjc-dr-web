import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "@/features/menu/MenuSlice";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import menuItems from "@/routes/menuItems";

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
  const normalizedPath = pathname.replace(/^\/(ko|en)(\/|$)/, "");

  const isPathMatch = (routePath: string, currentPath: string): boolean => {
    const escaped = routePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pathPattern = escaped.replace(/\\:([^/]+)/g, "[^/]+");
    const regex = new RegExp(`^${pathPattern}$`);

    return regex.test(currentPath);
  };

  const findBreadcrumbs = (routes: Menu[]): BreadcrumbItem[] | null => {
    for (const route of routes) {
      const routePath = route.path ?? "";
      const current: BreadcrumbItem[] =
        route.menuType === "MENU"
          ? [
              {
                path: routePath,
                label: route.label,
                hasPage: true,
              },
            ]
          : [
              {
                label: route.label,
                hasPage: false,
              },
            ];

      if (routePath && isPathMatch(routePath, normalizedPath)) {
        return current;
      }

      if (route.children && route.children.length > 0) {
        const childResult = findBreadcrumbs(route.children);
        if (childResult) {
          return [...current, ...childResult];
        }
      }
    }

    return null;
  };

  const breadcrumbs = findBreadcrumbs(menuItems) ?? [];

  const pageTitle =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : "Home";

  return (
    <div className="content_wrap">
      <div className="location">
        {/* 1. 상단 로케이션/타이틀 바 */}
        <div className="page_path">
          <h2 className="tit">{pageTitle}</h2>
        </div>

        {/* 1-2. Breadcrumbs */}
        <div className="local">
          <Breadcrumbs
            separator={<NavigateNextIcon className="breadcrumbs_icon" />}
            className="breadcrumbs"
          >
            <Link component={NavLink} to="/ko/home" className="home_icon">
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
                  to={`/ko/${item.path}`}
                  className="current_text"
                >
                  {item.label}
                </Link>
              );
            })}
          </Breadcrumbs>
        </div>
      </div>

      {/* 2. 하단 컨텐츠 영역 (Outlet이 렌더링되는 곳) */}
      <div className="content">{children}</div>
    </div>
  );
}
