import type { Menu } from "./MenuSlice";
import type { ComponentKey } from "@/routes/ComponentMap";
import staticMenuItems from "@/routes/menuItems";
import {
  isDrAdminUser,
  isDrCancelAdminUser,
  type AuthUserLike,
} from "@/features/auth/authAccess";

const normalizePath = (value?: string) =>
  String(value ?? "")
    .replace(/^\/+|\/+$/g, "")
    .trim();

const joinPath = (parent: string, child?: string) => {
  const rawChild = String(child ?? "").trim();
  if (rawChild.startsWith("/")) {
    return normalizePath(rawChild);
  }

  const p = normalizePath(parent);
  const c = normalizePath(child);

  if (p && c && (c === p || c.startsWith(`${p}/`))) {
    return c;
  }

  if (!p) return c;
  if (!c) return p;
  return `${p}/${c}`;
};

const collectMenus = (menus: Menu[], parentPath = "", acc: Menu[] = []) => {
  menus.forEach((menu) => {
    const fullPath = joinPath(parentPath, menu.path);
    acc.push({
      ...menu,
      path: fullPath || menu.path,
    });

    if (menu.children?.length) {
      collectMenus(menu.children, fullPath, acc);
    }
  });

  return acc;
};

const staticMenuIndex = () => {
  const index = new Map<string, Menu>();

  collectMenus(staticMenuItems).forEach((menu) => {
    const key = normalizePath(menu.path);
    if (key) {
      index.set(key, menu);
    }
  });

  return index;
};

const hiddenStaticRoutes = () =>
  collectMenus(staticMenuItems)
    .filter((menu) => menu.menu === false && menu.element)
    .map((menu) => ({ ...menu }));

const normalizeComponentKey = (value?: unknown): ComponentKey | undefined => {
  if (typeof value !== "string") return undefined;
  const key = value.trim();
  return key ? (key as ComponentKey) : undefined;
};

const normalizeElement = (
  menu: Menu & {
    elementKey?: unknown;
    elementCd?: unknown;
  },
  staticMatch?: Menu,
): Menu["element"] => {
  const rawElement = menu.element;

  if (typeof rawElement === "string") {
    const key = normalizeComponentKey(rawElement);
    if (key) {
      return { ko: key, en: key };
    }
  }

  if (rawElement && typeof rawElement === "object") {
    const keyKo = normalizeComponentKey((rawElement as { ko?: unknown }).ko);
    const keyEn = normalizeComponentKey((rawElement as { en?: unknown }).en);

    if (keyKo || keyEn) {
      return {
        ko: keyKo ?? keyEn,
        en: keyEn ?? keyKo,
      };
    }
  }

  const fallbackKey =
    normalizeComponentKey(menu.elementKey) ?? normalizeComponentKey(menu.elementCd);

  if (fallbackKey) {
    return { ko: fallbackKey, en: fallbackKey };
  }

  return staticMatch?.element;
};

const STATIC_MENU_INDEX = staticMenuIndex();
const HIDDEN_STATIC_ROUTES = hiddenStaticRoutes();

const enrichMenuTree = (menus: Menu[], parentPath = ""): Menu[] =>
  menus.map((menu) => {
    const fullPath = joinPath(parentPath, menu.path);
    const staticMatch = STATIC_MENU_INDEX.get(normalizePath(fullPath));

    return {
      ...staticMatch,
      ...menu,
      path: fullPath || menu.path,
      menuType: menu.menuType ?? staticMatch?.menuType,
      permission: menu.permission ?? staticMatch?.permission,
      element: normalizeElement(menu, staticMatch),
      menu: menu.menu ?? staticMatch?.menu,
      children: menu.children?.length
        ? enrichMenuTree(menu.children, fullPath)
        : undefined,
    };
  });

const FORCED_VISIBLE_STATIC_PATHS = new Set([
  normalizePath("digitalDoc/temp"),
  normalizePath("external-view"),
]);

const appendHiddenStaticRoutes = (menus: Menu[]): Menu[] => {
  const existingPaths = new Set(
    collectMenus(menus)
      .map((menu) => normalizePath(menu.path))
      .filter(Boolean),
  );

  const missingHiddenRoutes = HIDDEN_STATIC_ROUTES.filter((menu) => {
    const key = normalizePath(menu.path);
    return key && !existingPaths.has(key);
  });

  const forcedVisibleRoutes = collectMenus(staticMenuItems)
    .filter((menu) => {
      const key = normalizePath(menu.path);
      return key && FORCED_VISIBLE_STATIC_PATHS.has(key) && !existingPaths.has(key);
    })
    .map((menu) => ({ ...menu }));

  return [...menus, ...forcedVisibleRoutes, ...missingHiddenRoutes];
};

const DOC_CLASSIFICATION_PATH_PREFIX = normalizePath("docClassification");
const DOC_DESTRUCTION_APPROVAL_PATH = normalizePath("destruction/appvList");
const MEMBER_MANAGEMENT_PATH_PREFIX = normalizePath("members");

type ExcludedMenuRule = {
  path: string;
  includeChildren?: boolean;
};

const getExcludedMenuRules = (user?: AuthUserLike | null) => {
  if (isDrAdminUser(user)) {
    return [];
  }

  if (isDrCancelAdminUser(user)) {
    return [
      {
        path: DOC_CLASSIFICATION_PATH_PREFIX,
        includeChildren: true,
      },
      {
        path: MEMBER_MANAGEMENT_PATH_PREFIX,
        includeChildren: true,
      },
    ];
  }

  return [
    {
      path: DOC_CLASSIFICATION_PATH_PREFIX,
      includeChildren: true,
    },
    {
      path: DOC_DESTRUCTION_APPROVAL_PATH,
    },
    {
      path: MEMBER_MANAGEMENT_PATH_PREFIX,
      includeChildren: true,
    },
  ];
};

const isExcludedByAuthority = (path: string, rules: ExcludedMenuRule[]) =>
  rules.some((rule) => {
    if (path === rule.path) return true;
    return rule.includeChildren && path.startsWith(`${rule.path}/`);
  });

const filterMenusByAuthority = (
  menus: Menu[],
  user?: AuthUserLike | null,
): Menu[] => {
  const excludedRules = getExcludedMenuRules(user);

  return menus.flatMap((menu) => {
    const path = normalizePath(menu.path);

    if (path && isExcludedByAuthority(path, excludedRules)) {
      return [];
    }

    const children = menu.children?.length
      ? filterMenusByAuthority(menu.children, user)
      : undefined;

    return [
      {
        ...menu,
        children,
      },
    ];
  });
};

export const getRuntimeMenuTree = (
  menus?: Menu[],
  user?: AuthUserLike | null,
): Menu[] => {
  const runtimeMenus = !menus?.length
    ? staticMenuItems
    : appendHiddenStaticRoutes(enrichMenuTree(menus));

  return filterMenusByAuthority(runtimeMenus, user);
};

export { joinPath, normalizePath };
