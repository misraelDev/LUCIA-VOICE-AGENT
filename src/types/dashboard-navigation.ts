/**
 * Contrato alineado con el API REST (AuthResponse + NavigationResponseDTO).
 * Ids de sección; la URL y el título del menú viven en dashboard-navigation-registry.tsx.
 */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export const DASHBOARD_NAV_SECTION_IDS = [
  "user_home",
  "user_call_history",
  "user_conversations",
  "user_appointments",
  "user_contacts",
  "admin_home",
  "admin_users",
  "admin_tenants",
] as const;

export type DashboardNavSectionId = (typeof DASHBOARD_NAV_SECTION_IDS)[number];

/** Ids asignables al rol user / seller en navigation_config. */
export const USER_ROLE_NAV_IDS = DASHBOARD_NAV_SECTION_IDS.filter((id) =>
  id.startsWith("user_"),
) as readonly DashboardNavSectionId[];

/** Ids asignables al rol admin en navigation_config. */
export const ADMIN_ROLE_NAV_IDS = DASHBOARD_NAV_SECTION_IDS.filter((id) =>
  id.startsWith("admin_"),
) as readonly DashboardNavSectionId[];

export interface TenantBriefDto {
  id: number;
  name: string;
}

export interface DashboardNavigationPayload {
  navigation: string[];
  tenant: TenantBriefDto | null;
}

export function parseTenantBriefDto(value: unknown): TenantBriefDto | null {
  if (value === null || value === undefined) return null;
  if (!isRecord(value)) return null;
  const idRaw = value.id;
  const name = value.name;
  if (typeof name !== "string") return null;
  const id =
    typeof idRaw === "number"
      ? idRaw
      : typeof idRaw === "string"
        ? Number(idRaw)
        : NaN;
  if (!Number.isFinite(id)) return null;
  return { id, name };
}

export function extractDashboardNavigationPayload(
  data: unknown,
): DashboardNavigationPayload | null {
  if (!isRecord(data)) return null;
  let navigation: string[] = [];
  if (data.navigation !== undefined && data.navigation !== null) {
    if (!Array.isArray(data.navigation)) return null;
    navigation = data.navigation.filter(
      (x): x is string => typeof x === "string",
    );
  }
  return {
    navigation,
    tenant: parseTenantBriefDto(data.tenant),
  };
}

export function isDashboardNavSectionId(id: string): id is DashboardNavSectionId {
  return (DASHBOARD_NAV_SECTION_IDS as readonly string[]).includes(id);
}
