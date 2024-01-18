"use client";

import LabelInput from "@/components/labelInput";
import { Button } from "@/components/ui/button";
import { PATH } from "@/constants/path";
import { useUserContext } from "@/context/store";
import { redirect } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ImageUploadPreview from "./bannerUploadPreview";
import { ExternalLink } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useCompanyGeneral } from "@/hooks/useCompanyGeneralInfo";
import { useCallback, useEffect, useMemo } from "react";
import { IGeneralInfoFormProps } from "@/types/update-general-info-form.type";
import useFormUpdate from "@/hooks/useFormUpdate";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { toast } from "react-toastify";
import LogoUploadPreview from "./logoUploadPreview";

const requiredMessage = "This field is required.";

export interface IGeneralInfoFormSubmitProps {
  name: string;
  website: string;
  shortDescription?: string;
  previewLogoUrl?: string;
  previewBannerUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

const GeneralInfoForm = () => {
  const { user } = useUserContext();

  if (!user) {
    redirect(PATH.HOME.path);
  }
  const {
    data: companyGeneralInfo,
    isLoading: generalInfoLoading,
    mutate,
  } = useCompanyGeneral(user.companyId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        name: companyGeneralInfo?.name,
        website: companyGeneralInfo?.website,
        shortDescription: companyGeneralInfo?.shortDescription,
        logoFile: companyGeneralInfo?.logoUrl,
        bannerFile: companyGeneralInfo?.bannerUrl,
      };
    }, [
      companyGeneralInfo?.bannerUrl,
      companyGeneralInfo?.logoUrl,
      companyGeneralInfo?.name,
      companyGeneralInfo?.shortDescription,
      companyGeneralInfo?.website,
    ]),
  });

  const {
    isLoading,
    error,
    success,
    submitForm,
    reset: submitFormReset,
  } = useFormUpdate<IGeneralInfoFormSubmitProps>({
    url: getEndpointUrl(ENDPOINTS.companyGeneralInfo(user.companyId)),
  });

  const { submitForm: submitImageForm } = useFormUpdate<FormData>({
    url: getEndpointUrl(ENDPOINTS.uploadSingle),
  });

  const onSubmit = (async (data: IGeneralInfoFormProps) => {
    const logoFormData = new FormData();

    let logoUrl = companyGeneralInfo.logoUrl;
    if (data.logoFile && data.logoFile[0]) {
      logoFormData.append("file", data.logoFile[0]);

      const resLogo = await submitImageForm(logoFormData);
      logoUrl = resLogo.data;
    }

    const bannerFormData = new FormData();
    let bannerUrl;
    if (!data.bannerFile) {
      // If no banner file provided, remove the banner
      bannerUrl = "";
    } else if (data.bannerFile[0]) {
      // If a new banner file is present, upload it
      bannerFormData.append("file", data.bannerFile[0]);
      const resBanner = await submitImageForm(bannerFormData);
      bannerUrl = resBanner.data;
    } else {
      // If the same banner file is retained, keep the current banner URL
      bannerUrl = companyGeneralInfo.bannerUrl;
    }

    // Submit the form data with updated logo and banner URLs
    submitForm({ ...data, logoUrl, bannerUrl });
    submitFormReset();
    resetAsyncForm();
    reset(data);
  }) as SubmitHandler<FieldValues>;

  const resetAsyncForm = useCallback(async () => {
    await mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reset(companyGeneralInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalInfoLoading]);

  useEffect(() => {
    if (success) {
      toast.success("Your changes have been saved 👍");
    }
    if (error) {
      toast.error("Something's wrong. Please try again.");
    }
  }, [success, error]);

  return (
    <form
      className="space-y-6 mt-6 w-[25rem]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="font-bold text-2xl">General Info</h2>
      <LabelInput
        register={register("name", {
          required: requiredMessage,
        })}
        label="Company Name"
        errorMessage={errors.name?.message as string}
      />
      <LabelInput
        register={register("website", {
          required: requiredMessage,
        })}
        label="Company Website"
        placeholder="https://example.com"
        errorMessage={errors.website?.message as string}
      />
      <div>
        <Label htmlFor={"shortDescription"}>Short Company Description</Label>
        <Textarea
          id={"shortDescription"}
          {...register("shortDescription", {
            required: requiredMessage,
          })}
        />
        {(errors.shortDescription?.message as string) ? (
          <p className="font-medium text-red-500 text-xs mt-1">
            {errors.shortDescription?.message as string}
          </p>
        ) : (
          <p className="font-medium text-gray-500 text-xs mt-1">
            Please keep the description to under 200 characters for best
            results. This is approximately 1-3 sentences.
          </p>
        )}
      </div>
      <p className="font-bold text-sm">Company Logo</p>
      <p className="text-sm text-dark-800">
        Your logo will display at the top of your profile page. For best
        results, use an square image. We recommend 150px by 150px. Please keep
        the file size under 5MB.
      </p>
      <div>
        <LogoUploadPreview
          previewShape="square"
          buttonLabel="Add logo image"
          removeLabel="Remove logo image"
          defaultValue={companyGeneralInfo?.previewLogoUrl}
          register={register}
          isLoading={generalInfoLoading}
          setValue={setValue}
        />
        <p className="font-medium text-red-500 text-xs mt-1">
          {errors.logoFile?.message as string}
        </p>
      </div>
      <p className="font-bold text-sm">Banner</p>
      <p className="text-sm text-dark-800">
        Your banner will display at the top of your profile page. Please use an
        image that is 16:9 ratio - 800px wide by 450px tall. Also keep the file
        size under 10MB.
      </p>
      <div>
        <ImageUploadPreview
          previewShape="rectangle"
          buttonLabel="Add banner image"
          removeLabel="Remove banner image"
          defaultValue={companyGeneralInfo?.previewBannerUrl}
          register={register}
          isLoading={generalInfoLoading}
          setValue={setValue}
        />
        <p className="font-medium text-red-500 text-xs mt-1">
          {errors.bannerFile?.message as string}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="w-full gap-1 p-0 justify-start disabled:bg-transparent shadow-none disabled:text-gray-300 disabled:opacity-100"
          disabled={true}
        >
          <ExternalLink /> Preview
        </Button>
        <Button
          variant={"outline"}
          className="w-fit px-2 shadow-none text-gray-500 border-0"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-[7rem] disabled:bg-gray-150/20 shadow-none disabled:text-[#A2ABBA] disabled:opacity-100"
          disabled={!isDirty || isLoading}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default GeneralInfoForm;
