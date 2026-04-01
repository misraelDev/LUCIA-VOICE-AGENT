export function formatRoleToSpanish(role?: string): string {
  switch ((role || "").toLowerCase()) {
    case "admin":
      return "Administrador";
    case "seller":
      return "Vendedor";
    case "user":
      return "Usuario";
    default:
      return role || "Usuario";
  }
}
