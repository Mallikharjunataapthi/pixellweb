"use client";

import AdminRegistrationForm from "@/components/adminregistrationForm";
import AdminAuthLayout from "../layout";

const AdminRegistrationPage = () => {
  return (
    <AdminAuthLayout>
      <div className="mx-auto">
        <AdminRegistrationForm />
      </div>
    </AdminAuthLayout>
  );
};

export default AdminRegistrationPage;
