
export enum SystemRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  TRAINER = "trainer",
  CUSTOMER = "customer",
}

export const SystemRoleLabelMap: Record<SystemRole, string> = {
  [SystemRole.SUPER_ADMIN]: "Super Admin",
  [SystemRole.ADMIN]: "Admin",
  [SystemRole.TRAINER]: "Trainer",
  [SystemRole.CUSTOMER]: "Customer",
};

export const getSystemRoleLabel = (role: SystemRole): string => {
  return SystemRoleLabelMap[role] ?? role;
};



