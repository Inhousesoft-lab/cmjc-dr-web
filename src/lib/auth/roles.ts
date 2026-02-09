export type Role = string

/**
 * Minimal role source for UI-level navigation guarding.
 * If your backend/auth exists, replace this with real session state.
 *
 * By default:
 * - reads JSON array from sessionStorage key 'roles'
 * - falls back to ['PUBLIC']
 */
export function getRoles(): Role[] {
  try {
    const raw = sessionStorage.getItem('roles')
    if (!raw) return ['PUBLIC']
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map(String)
    return ['PUBLIC']
  } catch {
    return ['PUBLIC']
  }
}

export function hasAnyRole(userRoles: Role[], required?: Role[]) {
  if (!required || required.length === 0) return true
  const set = new Set(userRoles)
  return required.some((r) => set.has(r))
}
