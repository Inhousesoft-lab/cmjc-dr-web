import type { Menu } from "@/features/menu/MenuSlice";
import { FALLBACK_LANG, type SupportedLang, normalizeLang } from "@/routes/lang";
import type { AuthUserLike } from "@/features/auth/authAccess";

const DEFAULT_LANDING_SEGMENT = "digitalDoc/list";

export const getDefaultLandingSegment = (
  menus?: Menu[],
  user?: AuthUserLike | null,
): string => {
  void menus;
  void user;
  return DEFAULT_LANDING_SEGMENT;
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
