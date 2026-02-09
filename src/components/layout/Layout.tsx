import { useCallback, useEffect, useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Outlet } from "react-router-dom";
import SimpledHeader from "@/components/layout/SimpledHeader";
import AdminSidebar from "@/components/common/AdminSidebar";
import ecrfMenuItems from "../../routes/menuItems";
import PageHeader from "@/components/common/PageHeader";

export default function Layout() {
  const convertToMenuItems = (routes: any) =>
    routes
      .filter((r: any) => r.label && r.menu)
      .map((r: any) => ({
        key: r.path?.startsWith("/") ? r.path : `/${r.path}`,
        path: r.path,
        label: r.label,
        children: r.children ? convertToMenuItems(r.children) : undefined,
      }));

  const menuItems = convertToMenuItems(ecrfMenuItems);

  const [isNavigationExpanded, setIsNavigationExpanded] = useState(true);
  const desktopExpandedRef = useRef(isNavigationExpanded);
  const navigationExpandedRef = useRef(isNavigationExpanded);
  const isNarrowViewport = useMediaQuery("(max-width:700px)");

  useEffect(() => {
    navigationExpandedRef.current = isNavigationExpanded;
  }, [isNavigationExpanded]);

  useEffect(() => {
    if (isNarrowViewport) {
      desktopExpandedRef.current = navigationExpandedRef.current;
      setIsNavigationExpanded(false);
      return;
    }

    setIsNavigationExpanded(desktopExpandedRef.current);
  }, [isNarrowViewport]);

  const handleToggleHeaderMenu = useCallback(
    (isExpanded: boolean) => {
      setIsNavigationExpanded(isExpanded);
      if (!isNarrowViewport) {
        desktopExpandedRef.current = isExpanded;
      }
    },
    [isNarrowViewport, setIsNavigationExpanded],
  );

  return (
    <div className="ecrf_layout">
      <SimpledHeader
        menuOpen={isNavigationExpanded}
        onToggleNav={handleToggleHeaderMenu}
      />
      <div className="layout_container">
        <AdminSidebar expanded={isNavigationExpanded} items={menuItems} />
        <div className="contents_container">
          <PageHeader>
            <Outlet />
          </PageHeader>
        </div>
      </div>
    </div>
  );
}
