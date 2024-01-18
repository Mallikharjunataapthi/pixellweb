"use client";

import Breadcrumbs from "@/components/breadcrumb";
import GeneralInfoForm from "@/components/generalInfoForm";
import { PATH } from "@/constants/path";
import { useUserContext } from "@/context/store";
import { redirect } from "next/navigation";

const breadcrumbItems = [
  {
    label: PATH.HOME.name,
    path: PATH.HOME.path,
  },
  {
    label: PATH.GENERAL_INFO.name,
    path: PATH.GENERAL_INFO.path,
  },
  {
    label: PATH.GENERAL_INFO.name,
    path: PATH.GENERAL_INFO.path,
  },
];

const GeneralInfo = () => {
  const { user } = useUserContext();

  if (!user) {
    redirect(PATH.HOME.path);
  }

  return (
    <div className="my-6 mx-9">
      <Breadcrumbs items={breadcrumbItems} />
      <GeneralInfoForm />
    </div>
  );
};

export default GeneralInfo;
