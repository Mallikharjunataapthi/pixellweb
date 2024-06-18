export interface AdminRegisterFormData {
  username: string;
  password: string;
  confirm_password?: string;
  email: string;
  role_id: string;
  is_active: string;
  app_id: string;
  profile_img?: File[];
}
