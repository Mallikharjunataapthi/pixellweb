export type APPROVAL_STATUS = "approved" | "completed";
export type CompleteSetupTokenUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  approvalStatus: APPROVAL_STATUS;
};

export type UseAccountRegisterProps = {
  token: string;
  password: string;
};

export type UseLoginProps = {
  email: string;
  password: string;
};
