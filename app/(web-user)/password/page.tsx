"use client";

import PasswordForm from "@/components/passwordForm";
import Spinner from "@/components/spinner";
import { redirect, useSearchParams } from "next/navigation";
import CompleteSetupProgressBar from "@/components/completeSetupAccountProgressBar";
import { APPROVAL_STATUS } from "@/constants/approvalStatus";
import StripePricingTable from "@/components/stripePricingTable";
import { useCompleteSetupTokenValidate } from "@/hooks/useCompleteSetupTokenValidate";
import { useUserContext } from "@/context/store";
import { PATH } from "@/constants/path";

const PasswordPage = () => {
  const { user: loggedInUser } = useUserContext();

  if (loggedInUser) {
    redirect(PATH.HOME.path);
  }

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useCompleteSetupTokenValidate(token as string);

  if (isLoading) {
    return (
      <div className="m-auto h-full">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="m-auto">{error.message}</div>;
  }

  if (user.approvalStatus === APPROVAL_STATUS.approved)
    return (
      <div className="w-full">
        <p className="font-bold text-2xl mt-9 text-center">
          👋 Hello {user.firstName}, let&apos;s finish your sign-up
        </p>
        <div className="mt-6 items-center justify-center">
          <CompleteSetupProgressBar step={1} />
        </div>
        <hr className="w-full mt-6" />
        <div className="w-[25rem] mx-auto">
          <PasswordForm token={token as string} user={user} mutate={mutate} />
        </div>
      </div>
    );
  if (user.approvalStatus === APPROVAL_STATUS.completed) {
    return (
      <div className="w-full">
        <p className="font-bold text-2xl mt-9 text-center">
          👋 Hello {user.firstName}, let&apos;s finish your sign-up
        </p>
        <div className="mt-6 items-center justify-center">
          <CompleteSetupProgressBar step={2} />
        </div>
        <hr className="w-full mt-6" />
        <div className="w-full mx-auto mt-6 space-y-6">
          <StripePricingTable customerEmail={user.email} />
          <div className="flex justify-center">
            <p className="w-[20rem] italic text-sm">
              ** Note: we use Stripe for payments. The next step will take you
              to a Stripe form to process your payment. Don&apos;t worry,
              you&apos;ll be redirected back here when you&apos;re finished.
            </p>
          </div>
        </div>
      </div>
    );
  }
};

export default PasswordPage;
