"use client";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
import TagForm from "@/components/TagForm";
interface AdminTagPageProps {
  params: {
    id: number | undefined;
  };
}
const AdminTagPage = (props: AdminTagPageProps) => {
  const id = props?.params?.id;

  if (id == undefined || id == null || id == 0) {
    redirect(PATH.CategoryList.path);
  }

  return <TagForm id={id} />;
};

export default AdminTagPage;
