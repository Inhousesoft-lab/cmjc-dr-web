import type { Menu } from "@/features/menu/MenuSlice";
import { getRuntimeMenuTree, normalizePath } from "@/features/menu/runtimeMenu";
import { componentMap } from "@/routes/ComponentMap";
import { FALLBACK_LANG, type SupportedLang, normalizeLang } from "@/routes/lang";
import type { AuthUserLike } from "@/features/auth/authAccess";

const hasMappedComponent = (menu: Menu) => {
  const koKey = menu.element?.ko;
  const enKey = menu.element?.en;
  return (!!koKey && !!componentMap[koKey]) || (!!enKey && !!componentMap[enKey]);
};

const findDefaultLandingSegment = (menus: Menu[]): string | null => {
  for (const menu of menus) {
    if (menu.menu === false) continue;

    if (menu.children?.length) {
      const childPath = findDefaultLandingSegment(menu.children);
      if (childPath) return childPath;
    }

    const path = normalizePath(menu.path);
    if (path && hasMappedComponent(menu)) {
      return path;
    }
  }

  return null;
};

export const getDefaultLandingSegment = (
  menus?: Menu[],
  user?: AuthUserLike | null,
): string => {
  const runtimeMenus = getRuntimeMenuTree(menus, user);
  return findDefaultLandingSegment(runtimeMenus) ?? "";
};

export const getDefaultLandingPath = (
  lang?: string | null,
  menus?: Menu[],
  user?: AuthUserLike | null,
): string => {
  const normalizedLang = normalizeLang(lang) ?? FALLBACK_LANG;
  const segment = getDefaultLandingSegment(menus, user);

  return segment ? `/${normalizedLang}/${segment}` : `/${normalizedLang}`;
};

export const getDefaultLandingHref = (
  lang: SupportedLang,
  menus?: Menu[],
  user?: AuthUserLike | null,
): string => getDefaultLandingPath(lang, menus, user);
