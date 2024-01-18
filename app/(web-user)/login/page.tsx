"use client";
import LoginForm from "@/components/loginForm";
import { PATH } from "@/constants/path";
import { useUserContext } from "@/context/store";
import { redirect } from "next/navigation";

function LoginPage() {
  const { user } = useUserContext();

  if (user) redirect(PATH.HOME.path);

  return (
    <div className="mx-auto">
      <LoginForm />
    </div>
  );
}

export default LoginPage;
