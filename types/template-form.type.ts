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
  api_to_call: string;
  user_id: string;
  tag_name: { value: string; label: string }[];
  aspect_ratio_x: number;
  aspect_ratio_y: number;
  prompt: string;
  style_name: string;
  identitynet_strength_ratio: number;
  adapter_strength_ratio: number;
  num_steps: number;
  seed: number;
}
