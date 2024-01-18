const baseUrl = `${process.env.NEXT_PUBLIC_XDS_API_URL}`;

export const ENDPOINTS = {
  adminlogin: "/auth/signin",
  adminRegister: "/auth/signup",
  category: "/category",
  addcategory: "/Category",
  templatefeedback: "/report-template",
  getActiveList: () => `/activelist`,
  declinetemplate: () => `/declinetemplate`,
  approvetemplate: () => `/approvetemplate`,

  users: "/users",
  templates: "/templates",
  addtemplate: "/templates",
  tags: "/tags",
  updatecategory: "/category/update",
  register: "/auth/register",
  setupPassword: "/passwords",
  validateCompleteSetupAccountToken: "/registration-requests/validate",
  login: "/auth/login",
  verifyToken: "/auth/verify-token",
  updatePersonalSetting: (userId: number) =>
    `/users/${userId}/personal-settings`,
  backupPersonalContact: (userId: number) =>
    `/users/${userId}/backup-personal-contacts`,
  companyGeneralInfo: (companyId: number) =>
    `/companies/${companyId}/general-info`,
  uploadSingle: "/uploads/single",
  deleteTag: (tagId: string) => `/delete-tag/${tagId}/`,
  updateTag: (tagId: number) => `/update-tag/${tagId}`,
  adminreport: "/admin-report",
  mostactiveusers: "/mostactiveusers",
  mostusedtemplates: "/mostusedtemplates",
};

export const getEndpointUrl = (endpoint: string): string => {
  return `${baseUrl}${endpoint}`;
};
