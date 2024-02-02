"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { AppFormData } from "@/types/app-form.type";
import { redirect } from "next/navigation";
import { PATH } from "@/constants/path";
import LabelInput from "@/components/labelInput";
import UseFormApp from "@/hooks/UseFormApp";
import Breadcrumbs from "@/components/breadcrumb";
import { useAdminContext } from "@/context/storeAdmin";
import Alertpop from "./ui/alertpop";
const AppForm = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  const requiredMessage = "This field is required.";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const url = getEndpointUrl(ENDPOINTS.apps);

  const { isLoading, error, success, submitForm } = UseFormApp<AppFormData>({
    url: url,
  });

  const onSubmit = ((data: AppFormData) => {
    submitForm(data);
  }) as SubmitHandler<FieldValues>;

  const is_existOptions = [
    { value: "1", label: "Active" },
    // { value: "0", label: "Inactive" },
    // Add more options as needed
  ];

  const breadcrumbItems = [
    {
      label: PATH.ADMINHOME.name,
      path: PATH.ADMINHOME.path,
    },
    {
      label: PATH.App.name,
      path: PATH.App.path,
    },
    {
      label: PATH.AddApp.name,
      path: PATH.AddApp.path,
    },
  ];
  if (success) {
    redirect(PATH.App.path);
  }
  return (
    <>
      <div className="py-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <section className="text-start">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {"Add App "}
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <LabelInput
                  register={register("app_name", {
                    required: requiredMessage,
                    pattern: {
                      value: /\S/,
                      message: "Enter text without empty spaces.",
                    },
                  })}
                  label="App Name"
                  errorMessage={errors.app_name?.message as string}
                />
                <div>
                  <label
                    htmlFor="is_exist"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status
                  </label>
                  <select
                    id="is_exist"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("is_exist", {
                      required: "This field is required.",
                    })}
                  >
                    {is_existOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {" "}
                    {errors.is_exist?.message as string}
                  </p>
                </div>
                {success && !error ? "App Added Successfully!" : ""}
                {error && (
                  <p className="font-medium text-red-500 text-xs mt-1">
                    <Alertpop error={error} colors="failure" />
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}{" "}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AppForm;
