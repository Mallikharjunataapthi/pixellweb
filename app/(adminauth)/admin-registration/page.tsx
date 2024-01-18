"use client";

import AdminRegistrationForm from "@/components/adminregistrationForm";
import { PATH } from "@/constants/path";
import { useUserContext } from "@/context/store";
import { redirect } from "next/navigation";
import AdminAuthLayout from "../layout";

const AdminRegistrationPage = () => {
  const { user } = useUserContext();

  if (user) {
    redirect(PATH.HOME.path);
  }

  return (
    <AdminAuthLayout>
      <div className="mx-auto">
        <AdminRegistrationForm />
      </div>
    </AdminAuthLayout>
  );
};

export default AdminRegistrationPage;
