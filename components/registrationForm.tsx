"use client";

import useFormRegister from "@/hooks/useFormRegister";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { RegisterFormData } from "@/types/register-form.type";

const RegistrationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const { isLoading, error, success, submitForm } =
    useFormRegister<RegisterFormData>({
      url: getEndpointUrl(ENDPOINTS.register),
    });

  const onSubmit = ((data: RegisterFormData) => {
    submitForm(data);
  }) as SubmitHandler<FieldValues>;

  return (
    <div className="max-w-[440px] space-y-6 my-6 mx-auto">
      <h4 className="font-bold text-center text-[22px]">
        {success
          ? "Thanks for registering with XDS Spark!"
          : "Register for XDS Spark"}
      </h4>
      <hr />
      <p className="text-base">
        {success
          ? "We will review your registration information and send you an email you once approved."
          : "Please fill in the form below and we will review it and get right back to you (all fields are required)."}
      </p>
      {!success && (
        <form
          className="w-full space-y-6 my-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {error && (
            <p className="font-medium text-red-500 text-xs mt-1">
              Error: {error}
            </p>
          )}
          <div>
            <Input
              type="text"
              id="firstName"
              {...register("firstName", {
                required: "This field is required.",
              })}
              label="First Name"
              aria-invalid={errors.firstName ? "true" : "false"}
            />
            <p className="font-medium text-red-500 text-xs mt-1">
              {errors.firstName?.message as string}
            </p>
          </div>

          <div>
            <Input
              type="text"
              id="lastName"
              {...register("lastName", {
                required: "This field is required.",
              })}
              label="Last Name"
            />
            <p className="font-medium text-red-500 text-xs mt-1">
              {errors.lastName?.message as string}
            </p>
          </div>

          <div>
            <Input
              type="text"
              id="linkedInUrl"
              {...register("linkedInUrl", {
                required: "This field is required.",
              })}
              label="Your LinkedIn Profile URL"
              placeholder="https://www.linkedin.com/in/yourprofilename/"
            />
            <p className="font-medium text-red-500 text-xs mt-1">
              {errors.lastName?.message as string}
            </p>
          </div>

          <div>
            <Input
              type="email"
              id="email"
              {...register("email", {
                required: "This field is required.",
              })}
              label="Company Email"
            />
            <p className="font-medium text-red-500 text-xs mt-1">
              {errors.lastName?.message as string}
            </p>
          </div>

          <div>
            <Input
              type="text"
              id="companyName"
              {...register("companyName", {
                required: "This field is required.",
              })}
              label="Company Name"
            />
            <p className="font-medium text-red-500 text-xs mt-1">
              {errors.lastName?.message as string}
            </p>
          </div>

          <div>
            <Input
              type="text"
              id="companyWebUrl"
              {...register("companyWebUrl", {
                required: "This field is required.",
              })}
              label="Company Website URL"
            />
            <p className="font-medium text-red-500 text-xs mt-1">
              {errors.lastName?.message as string}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold">
              Industry Type (please choose the one which best describes your
              business)
            </p>
            <p className="text-xs italic">
              ** For companies that are both industry types, but want to promote
              services, please select Service Provider. As a Service Provider,
              you can promote your company, and also buy services.
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                {...register("role", { required: true })}
                value="buyer"
                id="buyer"
                className="aspect-square h-4 w-4 rounded-full border border-gray-300"
              />
              <Label htmlFor="buyer" className="text-sm font-normal">
                Buyer of Services (developer/publisher, media company,
                enterprise)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                {...register("role", { required: true })}
                value="service_provider"
                id="service_provider"
                className="aspect-square h-4 w-4 rounded-full border border-gray-300"
              />
              <Label htmlFor="service_provider" className="text-sm font-normal">
                Service Provider
              </Label>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("agreeCheckbox", { required: true })}
              value="agreed"
              id="agreeCheckbox"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-400 data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor={"agreeCheckbox"}
              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pl-2"
            >
              I agree to the{" "}
              <a href="#" className="underline text-blue-300">
                {/* TODO: Update link to Terms & Conditions later */}
                XDS Spark Terms and Conditions
              </a>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? "Submitting..." : "Submit for Review"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm;
