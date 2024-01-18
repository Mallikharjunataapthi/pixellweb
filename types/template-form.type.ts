export interface TemplateFormData {
  cat_id: string;
  template_name: string;
  before_image_url: File[];
  after_image_url: File[];
  used_count: number;
  whishlist_count: number;
  propertiesjson?: string;
  is_free: string;
  feedType: string;
  is_active: string;
  tag_name: { value: string; label: string }[];
}