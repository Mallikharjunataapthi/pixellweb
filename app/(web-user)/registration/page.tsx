"use client";

import RegistrationForm from "@/components/registrationForm";
import { PATH } from "@/constants/path";
import { useUserContext } from "@/context/store";
import { redirect } from "next/navigation";

const RegistrationPage = () => {
  const { user } = useUserContext();

  if (user) {
    redirect(PATH.HOME.path);
  }

  return (
    <div className="mx-auto">
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;
