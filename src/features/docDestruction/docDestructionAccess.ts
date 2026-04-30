const DOC_DESTRUCTION_ROLE_ORDER = [
  "ADMIN",
  "CANCEL_ADMIN",
] as const;

export const DOC_DESTRUCTION_ROLES = new Set<string>(DOC_DESTRUCTION_ROLE_ORDER);

export const normalizeDocDestructionRoles = (roles: string[] = []) => {
  const normalized = new Set(
    roles
      .map((role) => String(role ?? "").trim())
      .filter(Boolean),
  );

  return Array.from(normalized);
};

export const hasDocDestructionAccess = (roles: string[] = []) =>
  normalizeDocDestructionRoles(roles).some((role) =>
    DOC_DESTRUCTION_ROLES.has(role),
  );

// 파기문서 진입은 탭 권한이 아니라 조회 가능 여부만 본다.
export const getDefaultDocDestructionPath = (roles: string[]) =>
  hasDocDestructionAccess(roles)
    ? "destruction/reqList"
    : "destruction/list";
