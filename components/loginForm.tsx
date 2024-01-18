"use client";

import { PasswordInput } from "./ui/passwordInput";
import { Button } from "./ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import useLogin from "@/hooks/useLogin";
import LabelInput from "./labelInput";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { PATH } from "@/constants/path";
type LoginFormProps = {
  email?: string;
  password?: string;
};

const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormProps>();

  const { isLoading, error, success, login } = useLogin();

  const onSubmit: SubmitHandler<LoginFormProps> = (data) => {
    login({
      email: data.email as string,
      password: data.password as string,
    });
  };

  useEffect(() => {
    if (success) {
      router.push(PATH.HOME.path);
    }
  }, [router, success]);

  return (
    <div className="w-[440px] space-y-6 my-6 mx-auto">
      <h4 className="font-bold text-center text-[22px]">Login</h4>
      <hr />
      {error && (
        <p className="font-medium text-red-500 text-xs mt-5">{error}</p>
      )}
      <form className="w-full space-y-6 my-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <LabelInput
            className="w-full"
            id="email"
            register={register("email", {
              required: "This field is required",
            })}
            label="Email"
          />
        </div>
        <div>
          <PasswordInput
            register={register("password", {
              required: "This field is required",
            })}
            label="Password"
            placeholder="••••••••"
            errorMessage={errors.password?.message}
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="keepLoggedIn"
            className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-400 data-[state=checked]:text-primary-foreground"
          />
          <label
            htmlFor={"keepLoggedIn"}
            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pl-2"
          >
            Keep me logged in
          </label>
        </div>
        <Button
          type="submit"
          className="w-full font-medium"
          disabled={isLoading || !isValid}
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
        <div>
          <Link className="text-blue-350 hover:underline" href="#">
            Forgot Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
