import React, { useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Outlet } from "react-router-dom";
import SimpledHeader from "@/components/common/SimpleHeader";
import AdminSidebar from "@/components/common/AdminSidebar";
import ecrfMenuItems from "../../routes/menuItems";
import PageHeader from "@/components/common/PageHeader";
import { Menu } from "@/features/menu/MenuSlice";
import SimpleHeader from "@/components/common/SimpleHeader";

type SidebarMenuItem = {
  key: string;
  path: string;
  label: string;
  children?: SidebarMenuItem[];
};

const convertToMenuItems = (
  routes: Menu[],
  path: number[] = [],
): SidebarMenuItem[] =>
  routes
    .filter((r) => r.menu !== false && !!r.label)
    .map((r, idx) => {
      const currentPath = [...path, idx];
      const pathValue =
        typeof r.path === "string"
          ? r.path.startsWith("/")
            ? r.path
            : `/${r.path}`
          : "";

      return {
        key: r.menuId?.trim() || `idx-${currentPath.join("-")}`,
        path: pathValue,
        label: r.label!.trim(),
        children: r.children
          ? convertToMenuItems(r.children, currentPath)
          : undefined,
      };
    });

export default function Layout() {
  const menuItems = convertToMenuItems(ecrfMenuItems);

  const [isNavigationExpanded, setIsNavigationExpanded] = useState(true);
  const desktopExpandedRef = useRef(isNavigationExpanded);
  const navigationExpandedRef = useRef(isNavigationExpanded);
  const isNarrowViewport = useMediaQuery("(max-width:700px)");

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    const applySidebarMode = (isMobile: boolean) => {
      // 900 이하: 기본 닫힘 / 900 초과: 기본 열림
      setIsNavigationExpanded(!isMobile);
    };

    applySidebarMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      applySidebarMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleToggleSidebar = () => {
    setIsNavigationExpanded((prev) => !prev);
  };

  return (
    <div id="wrap" className={isNavigationExpanded ? "" : "collapsed"}>
      <AdminSidebar
        expanded={isNavigationExpanded}
        items={menuItems}
        onToggle={handleToggleSidebar}
      />
      <SimpleHeader />
      <div
        id="container"
        className={`${isNavigationExpanded ? "" : "collapsed"}`.trim()}
      >
        <PageHeader>
          <Outlet />
        </PageHeader>
      </div>
    </div>
  );
}
