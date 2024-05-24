"use client";
import AdminLoginForm from "@/components/adminloginForm";
import AdminAuthLayout from "../layout";
function AdminLoginPage() {
  return (
    <AdminAuthLayout>
      <div className="mx-auto">
        <AdminLoginForm />
      </div>
    </AdminAuthLayout>
  );
}

export default AdminLoginPage;
