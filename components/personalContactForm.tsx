"use client";

import LabelInput from "@/components/labelInput";
import { Button } from "@/components/ui/button";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { PATH } from "@/constants/path";
import { useUserContext } from "@/context/store";
import { useBackupPersonalContact } from "@/hooks/useBackupPersonalContact";
import useFormUpdate from "@/hooks/useFormUpdate";
import { IPersonalSettingFormProps } from "@/types/update-personal-setting-form.type";
import { redirect } from "next/navigation";
import { useCallback, useEffect } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const requiredMessage = "This field is required.";

const PersonalSettingsForm = () => {
  const { user, mutate, handleSignOut } = useUserContext();

  if (!user) {
    redirect(PATH.HOME.path);
  }
  const { data: backupPersonalContact } = useBackupPersonalContact(user.id);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      linkedInUrl: user.linkedInUrl,
      backupFirstName: backupPersonalContact?.firstName,
      backupLastName: backupPersonalContact?.lastName,
      backupEmail: backupPersonalContact?.email,
    },
  });

  const watchedEmail = watch("email");

  const {
    isLoading,
    error,
    success,
    submitForm,
    reset: submitFormReset,
  } = useFormUpdate<IPersonalSettingFormProps>({
    url: getEndpointUrl(ENDPOINTS.updatePersonalSetting(user.id)),
  });

  const onSubmit = ((data: IPersonalSettingFormProps) => {
    submitForm(data);
    reset(data);
    submitFormReset();
  }) as SubmitHandler<FieldValues>;

  const resetAsyncForm = useCallback(async () => {
    await mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reset({
      backupFirstName: backupPersonalContact?.firstName,
      backupLastName: backupPersonalContact?.lastName,
      backupEmail: backupPersonalContact?.email,
    });
  }, [backupPersonalContact, reset]);

  useEffect(() => {
    if (success) {
      toast.success("Your changes have been saved 👍");
      resetAsyncForm();
      if (
        watchedEmail.trim().toLowerCase() !== user.email.trim().toLowerCase()
      ) {
        handleSignOut();
        redirect(PATH.LOGIN.path);
      }
    }
    if (error) {
      toast.error("Something's wrong. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, resetAsyncForm]);

  return (
    <form
      className="space-y-6 mt-6 w-[25rem]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="font-bold text-2xl">Personal Settings</h2>
      <p className="font-bold">Your Info (Primary Contact)</p>
      <LabelInput
        register={register("firstName", {
          required: requiredMessage,
        })}
        label="First Name"
        errorMessage={errors.firstName?.message as string}
      />
      <LabelInput
        register={register("lastName", {
          required: requiredMessage,
        })}
        label="Last Name"
        errorMessage={errors.lastName?.message as string}
      />
      <div>
        <LabelInput
          register={register("email", {
            required: requiredMessage,
          })}
          label="Email"
          errorMessage={errors.email?.message as string}
        />
        <p className="font-medium text-gray-500 text-xs mt-1">
          Note: Changing your email will require you to login after saving
        </p>
      </div>
      <LabelInput
        register={register("linkedInUrl", {
          required: requiredMessage,
        })}
        label="LinkedIn Profile"
        errorMessage={errors.linkedInUrl?.message as string}
      />
      <p className="font-bold">Secondary Backup Contact</p>
      <p className="text-sm text-dark-800">
        Please add a secondary contact in case we cannot contact you as the
        Spark administrator for your company.
      </p>
      <LabelInput
        register={register("backupFirstName")}
        name="backupFirstName"
        label="First Name"
        errorMessage={errors.backupFirstName?.message as string}
      />
      <LabelInput
        register={register("backupLastName")}
        name="backupLastName"
        label="Last Name"
        errorMessage={errors.backupLastName?.message as string}
      />
      <LabelInput
        type="email"
        register={register("backupEmail")}
        name="backupEmail"
        label="Email"
        errorMessage={errors.backupEmail?.message as string}
      />
      <div className="text-right">
        <Button
          className="w-[7rem] disabled:bg-gray-150/20 shadow-none disabled:text-[#A2ABBA] disabled:opacity-100"
          disabled={!isDirty || isLoading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default PersonalSettingsForm;
