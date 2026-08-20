export const ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [ROLES.ADMIN]: [ROLES.ADMIN, ROLES.USER],
  [ROLES.USER]: [ROLES.USER],
}

export function normalizeRole(role: string | undefined | null): string {
  return (role ?? '').trim().toUpperCase()
}

export function hasRole(userRole: string | undefined | null, requiredRole: string): boolean {
  const normalizedUser = normalizeRole(userRole)
  const normalizedRequired = normalizeRole(requiredRole)

  const userRoles = ROLE_HIERARCHY[normalizedUser as Role] ?? [normalizedUser].filter(Boolean)
  return userRoles.includes(normalizedRequired as Role)
}

export function hasAnyRole(
  userRole: string | undefined | null,
  requiredRoles: readonly string[],
): boolean {
  return requiredRoles.some((r) => hasRole(userRole, r))
}

export function isAdmin(role: string | undefined | null): boolean {
  return hasRole(role, ROLES.ADMIN)
}

export function isUser(role: string | undefined | null): boolean {
  return hasRole(role, ROLES.USER)
}
