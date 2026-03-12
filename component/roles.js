export const SystemRole = {
  SUPER_ADMIN: "super_admin",
  ADMIN: "admin",
  TRAINER: "trainer",
  CUSTOMER: "customer",
};

export const SystemRoleLabelMap = {
  [SystemRole.SUPER_ADMIN]: "Super Admin",
  [SystemRole.ADMIN]: "Admin",
  [SystemRole.TRAINER]: "Trainer",
  [SystemRole.CUSTOMER]: "Customer",
};

export const getSystemRoleLabel = (role) => {
  return SystemRoleLabelMap[role] || role;
};
