"use client";

import UseFormAdminRegister from "@/hooks/UseFormAdminRegister";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { AdminRegisterFormData } from "@/types/admin-register-form.type";
import Alertpop from "./ui/alertpop";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumb";
const AdminRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm();
  const password = watch("password");
  const confirm_password = watch("confirm_password");
  const { isLoading, error, success, submitForm } =
    UseFormAdminRegister<AdminRegisterFormData>({
      url: getEndpointUrl(ENDPOINTS.adminRegister),
    });

  const onSubmit = ((data: AdminRegisterFormData) => {
    if (password == confirm_password) {
      delete data.confirm_password;
      submitForm(data);
    }
  }) as SubmitHandler<FieldValues>;
  if (success) {
    redirect(PATH.UsersList.path);
  }
  const breadcrumbItems = [
    {
      label: PATH.ADMINHOME.name,
      path: PATH.ADMINHOME.path,
    },
    {
      label: PATH.AdddAdmin.name,
      path: PATH.AdddAdmin.path,
    },
  ];

  return (
    <>
      <div className="py-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <section className="ljgeifg">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              {error && <Alertpop error={error} colors="failure" />}
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="username"
                    id="username"
                    {...register("username", {
                      required: "This field is required.",
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                  {errors.username?.message as string}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    password
                  </label>
                  <input
                    type="password"
                    {...register("password", {
                      required: "This field is required.",
                    })}
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.password?.message as string}
                </div>
                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    {...register("confirm_password", {
                      required: "This field is required.",
                    })}
                    id="confirm_password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.confirm_password?.message as string}
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {password != confirm_password &&
                    password != null &&
                    password.length > 2 &&
                    confirm_password != null &&
                    confirm_password.length > 2
                      ? "password not matched"
                      : ""}
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? "Submitting..." : "Create an account"}{" "}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminRegistrationForm;
