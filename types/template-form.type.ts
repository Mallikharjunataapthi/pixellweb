export interface TemplateFormData {
  cat_id: string;
  template_name: string;
  before_image_url: File[];
  after_image_url: File[];
  used_count: number;
  whishlist_count: number;
  template_desc: string;
  is_free: string;
  feedType: string;
  is_active: string;
  app_id: string;
  base_image_path: string;
  purchase_url: string;
  user_id: string;
  tag_name: { value: string; label: string }[];
}
