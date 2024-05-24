"use client";

import CategoryForm from "@/components/categoryForm ";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
interface AdmincategoryPageProps {
  params: {
    id: number | undefined;
  };
}
const AdmincategoryPage = (props: AdmincategoryPageProps) => {
  const id = props?.params?.id;

  if (id == undefined || id == null || id == 0) {
    redirect(PATH?.CategoryList?.path);
  }
  return <CategoryForm id={id} />;
};

export default AdmincategoryPage;
