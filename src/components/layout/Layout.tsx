import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/common/AdminSidebar";
import menuItems from "@/routes/menuItems";
import PageHeader from "@/components/common/PageHeader";
import type { Menu } from "@/features/menu/MenuSlice";
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
  const [isNavigationExpanded, setIsNavigationExpanded] = React.useState(true);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");

    const applySidebarMode = (isMobile: boolean) => {
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

  const sidebarItems = convertToMenuItems(menuItems);

  return (
    <div id="wrap" className={isNavigationExpanded ? "" : "collapsed"}>
      <AdminSidebar
        expanded={isNavigationExpanded}
        items={sidebarItems}
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
