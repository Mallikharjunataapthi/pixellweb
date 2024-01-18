"use client";

import { CompleteSetupTokenUser } from "@/types/user.type";
import { PasswordInput } from "./ui/passwordInput";
import { Button } from "./ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCreateAccountWithPassword from "@/hooks/useCreateAccountWithPassword";
import { KeyedMutator } from "swr";

type PasswordFormProps = {
  token: string;
  user: CompleteSetupTokenUser | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: KeyedMutator<any>;
};

type PasswordFormData = {
  password?: string;
  confirmPassword?: string;
};

const PASSWORD_RULES_MESSAGE =
  "Please ensure the password meets the requirements - min 6 characters with at least one number, one letter, one special character";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, PASSWORD_RULES_MESSAGE)
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]+$/,
      PASSWORD_RULES_MESSAGE,
    ),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), ""],
      "The passwords do not match, please try again",
    ),
});

const PasswordForm = ({ token, user, mutate }: PasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(schema),
  });

  const { isLoading, error, success, setupPassword } =
    useCreateAccountWithPassword();

  const onSubmit: SubmitHandler<PasswordFormData> = (data) => {
    setupPassword({
      token,
      password: data.password as string,
    });
  };

  if (success) {
    mutate();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="font-bold text-center my-6">Create a Password</p>
        <p className="text-gray-800">First Name: {user?.firstName}</p>
        <p className="text-gray-800">Last Name: {user?.lastName}</p>
        <p className="text-gray-800">Email: {user?.email}</p>
        <p className="text-gray-800">Company: {user?.companyName}</p>
      </div>
      {error && (
        <p className="font-medium text-red-500 text-xs mt-1">Error: {error}</p>
      )}
      <div>
        <PasswordInput
          register={register("password")}
          label="Password"
          placeholder="••••••••"
          errorMessage={errors.password?.message}
          defaultMessage="Min 6 characters with at least one number, one letter, one special character"
        />
      </div>
      <div>
        <PasswordInput
          register={register("confirmPassword")}
          label="Re-enter Password"
          placeholder="••••••••"
          errorMessage={errors.confirmPassword?.message}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Loading..." : "Next, pick your billing cycle"}
      </Button>
    </form>
  );
};

export default PasswordForm;
