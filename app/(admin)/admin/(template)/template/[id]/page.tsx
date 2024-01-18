"use client";
import TemplateForm from "@/components/templateForm";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
interface AdminTemplatePageProps {
  params: {
    id: number | undefined;
  };
}
const AdminTemplatePage = (props: AdminTemplatePageProps) => {
  const id = props?.params?.id;
  if (id == undefined || id == null || id == 0) {
    redirect(PATH.TemplateList.path);
  }

  return (
    <div className="mx-auto">
      <TemplateForm id={id} />
    </div>
  );
};

export default AdminTemplatePage;
