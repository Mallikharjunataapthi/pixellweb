"use client";

import Breadcrumbs from "@/components/breadcrumb";
import PersonalSettingsForm from "@/components/personalContactForm";
import { PATH } from "@/constants/path";
import { useUserContext } from "@/context/store";
import { redirect } from "next/navigation";

const breadcrumbItems = [
  {
    label: PATH.HOME.name,
    path: PATH.HOME.path,
  },
  {
    label: PATH.PERSONAL_SETTINGS.name,
    path: PATH.PERSONAL_SETTINGS.path,
  },
  {
    label: PATH.PERSONAL_SETTINGS.name,
    path: PATH.PERSONAL_SETTINGS.path,
  },
];

const PersonalSettings = () => {
  const { user } = useUserContext();

  if (!user) {
    redirect(PATH.HOME.path);
  }

  return (
    <div className="my-6 mx-9">
      <Breadcrumbs items={breadcrumbItems} />
      <PersonalSettingsForm />
    </div>
  );
};

export default PersonalSettings;
