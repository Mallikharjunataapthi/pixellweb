"use client";
import AdminLoginForm from "@/components/adminloginForm";
import { PATH } from "@/constants/path";
import { useUserContext } from "@/context/store";
import { redirect } from "next/navigation";
import AdminAuthLayout from "../layout";
function AdminLoginPage() {
  const { user } = useUserContext();

  if (user) redirect(PATH.HOME.path);

  return (
    <AdminAuthLayout>
      <div className="mx-auto">
        <AdminLoginForm />
      </div>
    </AdminAuthLayout>
  );
}

export default AdminLoginPage;
