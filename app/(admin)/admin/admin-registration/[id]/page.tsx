"use client";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
import AdminRegistrationForm from "@/components/adminregistrationForm";
interface UserPageProps {
  params: {
    id: number | undefined;
  };
}
const AdminUserPage = (props: UserPageProps) => {
  const id = props?.params?.id;

  if (id == undefined || id == null || id == 0) {
    redirect(PATH.CategoryList.path);
  }

  return <AdminRegistrationForm id={id} />;
};

export default AdminUserPage;
