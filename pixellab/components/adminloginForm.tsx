"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PATH } from "@/constants/path";
import UseAdminLogin from "@/hooks/UseAdminLogin";
type AdminLoginFormProps = {
  username?: string;
  password?: string;
};

const AdminLoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AdminLoginFormProps>();

  const { isLoading, error, success, adminlogin } = UseAdminLogin();

  const onSubmit: SubmitHandler<AdminLoginFormProps> = (data) => {
    adminlogin({
      username: data.username as string,
      password: data.password as string,
    });
  };

  useEffect(() => {
    if (success) {
      router.push(PATH.UsersList.path);
    }
  }, [router, success]);

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <svg
            className="w-28 h-28 m-auto"
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
          <h1 className="text-2xl font-bold sm:text-3xl">
            Sign in to your account
          </h1>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-0 mt-8 max-w-md space-y-4"
        >
          <div>
            {error && (
              <p className="font-medium text-red-500 text-xs mt-5">{error}</p>
            )}
            <label htmlFor="username" className="sr-only">
              User Name
            </label>

            <div className="relative">
              <input
                type="username"
                className="border w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter User Name"
                {...register("username", {
                  required: "This field is required.",
                })}
              />
              {errors.username?.message as string}
              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              password
            </label>

            <div className="relative">
              <input
                type="password"
                className="border w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                {...register("password", {
                  required: "This field is required.",
                })}
              />
              {errors.password?.message as string}

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
              disabled={isLoading || !isValid}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminLoginForm;
