import * as React from "react";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getLangFromPathname, langPath, SupportedLang } from "@/routes/lang";
import { Link, useNavigate } from "react-router";
import Drawer from "./Drawer.module";

type MenuItem = {
  key: string;
  path: string;
  label: string;
  href?: string; // internal/external link
  children?: MenuItem[];
};

type MenuPath = {
  rootKey: string | null;
  openKeys: string[];
  activeKey: string | null;
};

export interface AdminSidebarProps {
  expanded?: boolean;
  defaultOpenKeys?: string[];
  items: MenuItem[];
  onSelectLeaf?: (item: MenuItem) => void;
}

function isExternalHref(key: string) {
  return /^https?:\/\//i.test(key);
}

export default function AdminSidebar({
  expanded = true,
  defaultOpenKeys,
  items,
  onSelectLeaf,
}: AdminSidebarProps) {
  const navigate = useNavigate();

  // ✅ 1depth(루트)는 항상 1개만 열리도록(아코디언)
  const [openRootKey, setOpenRootKey] = React.useState<string | null>(() => {
    const first = (defaultOpenKeys ?? [])[0];
    return first ?? null;
  });

  // ✅ 2depth/3depth 등 하위 메뉴의 open 상태
  const [openKeys, setOpenKeys] = React.useState<Set<string>>(() => {
    const keys = defaultOpenKeys ?? [];
    // root는 openRootKey로 관리하므로 여기서는 제외
    return new Set(keys.slice(1));
  });

  const toggle = React.useCallback((key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const isOpen = React.useCallback(
    (key: string, depth: number) => {
      if (depth === 0) return openRootKey === key;
      return openKeys.has(key);
    },
    [openKeys, openRootKey],
  );

  const curLang = React.useMemo(
    () => getLangFromPathname(location.pathname),
    [location.pathname],
  );

  const matchPathPrefix = (pathname: string, target: string) => {
    return pathname === target || pathname?.startsWith(target + "/");
  };

  const findMenuPath = (
    items: MenuItem[],
    pathname: string,
    curLang: SupportedLang,
  ): MenuPath => {
    for (const root of items) {
      const rootRaw = root.path ?? "";
      const rootPath = rootRaw ? langPath(rootRaw, curLang) : "";

      // ✅ 1depth leaf or hidden route under root
      if (
        rootPath &&
        matchPathPrefix(pathname, rootPath) &&
        !root.children?.length
      ) {
        return {
          rootKey: null,
          openKeys: [],
          activeKey: root.key,
        };
      }

      if (!root.children) continue;

      for (const child of root.children) {
        const raw = child.path ?? "";
        const fullPath = raw ? langPath(raw, curLang) : "";

        // ✅ 2depth leaf OR 하위 숨김 라우트
        if (fullPath && matchPathPrefix(pathname, fullPath)) {
          return {
            rootKey: root.key,
            openKeys: [],
            activeKey: child.key,
          };
        }

        if (child.children) {
          for (const grand of child.children) {
            const raw2 = grand.path ?? "";
            const fullPath2 = raw2 ? langPath(raw2, curLang) : "";

            // ✅ 3depth leaf OR 하위 숨김 라우트
            if (fullPath2 && matchPathPrefix(pathname, fullPath2)) {
              return {
                rootKey: root.key,
                openKeys: [child.key],
                activeKey: grand.key,
              };
            }
          }
        }
      }
    }

    return { rootKey: null, openKeys: [], activeKey: null };
  };
  const [activeKey, setActiveKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    const { rootKey, openKeys, activeKey } = findMenuPath(
      items,
      location.pathname,
      curLang,
    );
    setOpenRootKey(rootKey);
    setOpenKeys(new Set(openKeys));
    setActiveKey(activeKey);
  }, [location.pathname, items, curLang]);

  const resolveTo = React.useCallback(
    (item: { path: string }, hasChildren: boolean) => {
      if (hasChildren) return "#";

      const raw = item.path ?? "";
      if (!raw) return "#";

      return langPath(raw, curLang); // ✅ /ko prefix 붙음
    },
    [curLang],
  );

  const goLeaf = React.useCallback(
    (item: MenuItem) => {
      onSelectLeaf?.(item);

      if (!item.path) return;

      if (isExternalHref(item.path)) {
        window.open(item.path, "_blank", "noopener,noreferrer");
        return;
      }

      const raw = item.path ?? "";
      if (!raw) return;

      navigate(langPath(raw, curLang), { replace: false });
    },
    [navigate, onSelectLeaf, curLang],
  );

  const renderNode = (item: MenuItem, depth: number) => {
    const hasChildren = !!item.children?.length;
    const opened = hasChildren && isOpen(item.key, depth);
    const isActive = item.key === activeKey;

    const onClickNavLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (hasChildren) {
        // ✅ 1depth는 아코디언: 항상 1개만 열림
        if (depth === 0) {
          setOpenRootKey((prev) => {
            const next = prev === item.key ? null : item.key;
            return next;
          });
          // 루트가 바뀌면(또는 닫히면) 하위 open 상태는 초기화
          setOpenKeys(new Set());
          return;
        }

        // ✅ 2depth/3depth는 기존 방식대로 토글
        toggle(item.key);
        return;
      }
      goLeaf(item);
    };

    const to = resolveTo(item, hasChildren);

    return (
      <li
        key={item.key}
        className={[
          `depth-${depth}`,
          hasChildren ? "hasDepth" : "",
          opened ? "on" : "",
          isActive ? "active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Link
          to={to}
          onClick={onClickNavLink}
          aria-expanded={hasChildren ? opened : undefined}
          data-depth={depth}
        >
          <span className="lnb_label">{item.label}</span>
          {hasChildren && (
            <ChevronRightIcon
              className={["lnb_chevron", opened ? "is-open" : ""]
                .filter(Boolean)
                .join(" ")}
              aria-hidden
            />
          )}
        </Link>

        {hasChildren && (
          <div
            className={["lnb_subwrap", opened ? "is-open" : ""]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={!opened}
          >
            <ul className="lnb_sub">
              {item.children!.map((child) => renderNode(child, depth + 1))}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <Drawer variant="permanent" open={expanded}>
      <div className={`aside ${expanded ? "" : "collapsed"}`.trim()}>
        <div className="aside_inner">
          <div id="lnb">
            <ul className="lnb_list">
              {items.map((item) => renderNode(item, 0))}
            </ul>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
