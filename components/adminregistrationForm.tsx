"use client";

import UseFormAdminRegister from "@/hooks/UseFormAdminRegister";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { AdminRegisterFormData } from "@/types/admin-register-form.type";
import Link from "next/link";
const AdminRegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const { isLoading, error, success, submitForm } =
    UseFormAdminRegister<AdminRegisterFormData>({
      url: getEndpointUrl(ENDPOINTS.adminRegister),
    });

  const onSubmit = ((data: AdminRegisterFormData) => {
    submitForm(data);
  }) as SubmitHandler<FieldValues>;

  return (
    <>
      <section className="ljgeifg">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <svg
              className="w-8 h-8 mr-2"
              version="1.1"
              id="fi_281758"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 512 512"
            >
              <polygon
                style={{ fill: "#D32E2A" }}
                points="385.829,128 385.829,256 347.429,291.072 307.2,256 272.457,241.371 306.59,165.51 "
              ></polygon>
              <polygon
                style={{ fill: "#3A5BBC" }}
                points="384,385.219 256,385.219 255.39,383.391 226.133,356.291 255.39,308.041 270.629,271.848 
                    355.962,302.043 "
              ></polygon>
              <polygon
                style={{ fill: "#FBBB00" }}
                points="256.61,128.61 288.305,164.901 256.61,203.959 241.371,240.152 161.524,200.253 128,126.781 
                    256,126.781 "
              ></polygon>
              <polygon
                style={{ fill: "#28B446" }}
                points="239.543,270.629 204.495,346.843 126.171,384 126.171,256 163.962,232.558 204.8,256 "
              ></polygon>
              <polygon
                style={{ fill: "#518EF8" }}
                points="512,256 384,385.219 270.629,271.848 307.2,256 385.829,256 "
              ></polygon>
              <polygon
                style={{ fill: "#91C646" }}
                points="255.39,383.391 255.39,512 126.171,384 239.543,270.629 255.39,307.2 255.39,308.041 "
              ></polygon>
              <polygon
                style={{ fill: "#FFD837" }}
                points="241.371,240.152 204.8,256 126.171,256 0,256 128,126.781 "
              ></polygon>
              <polygon
                style={{ fill: "#F14336" }}
                points="385.829,128 272.457,241.371 256.61,204.8 256.61,203.959 256.61,128.61 256.61,0 "
              ></polygon>
            </svg>
            PixelLab
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create and account
              </h1>
              {success
                ? "Thanks for registering with Pixcellab!"
                : "Register for Pixcellab"}
              {error && (
                <p className="font-medium text-red-500 text-xs mt-1">
                  Error: {error}
                </p>
              )}
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
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
                    type="confirm_password"
                    {...register("confirm_password", {
                      required: "This field is required.",
                    })}
                    id="confirm_password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.confirm_password?.message as string}
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? "Submitting..." : "Create an account"}{" "}
                </button>

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/admin"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminRegistrationForm;
