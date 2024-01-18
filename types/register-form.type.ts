export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  companyWebUrl: string;
  linkedInUrl: string;
  role: "buyer" | "service_provider";
}
