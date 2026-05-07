export type AuthUserLike = {
  authrtCd?: string | null;
  roles?: string[] | null;
};

export const DR_AUTHORITY_CODES = {
  ADMIN: "ADMIN",
  CANCEL_ADMIN: "CANCEL_ADMIN",
  USER: "USER",
} as const;

const splitAuthorityCodes = (value?: string | null) =>
  String(value ?? "")
    .split(/[,\s|/]+/)
    .map((code) => code.trim())
    .map((code) => (code.startsWith("ROLE_") ? code.slice("ROLE_".length) : code))
    .filter(Boolean);

const getAuthorityCodeSet = (user?: AuthUserLike | null) => {
  const codes = new Set(splitAuthorityCodes(user?.authrtCd));
  (user?.roles ?? []).forEach((role) => {
    splitAuthorityCodes(role).forEach((code) => {
      codes.add(code.startsWith("ROLE_") ? code.slice("ROLE_".length) : code);
    });
  });
  return codes;
};

export const isDrAdminUser = (user?: AuthUserLike | null) => {
  return getAuthorityCodeSet(user).has(DR_AUTHORITY_CODES.ADMIN);
};

export const isDrCancelAdminUser = (user?: AuthUserLike | null) => {
  return getAuthorityCodeSet(user).has(DR_AUTHORITY_CODES.CANCEL_ADMIN);
};
