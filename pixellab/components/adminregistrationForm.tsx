"use client";

import UseFormAdminRegister from "@/hooks/UseFormAdminRegister";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { AdminRegisterFormData } from "@/types/admin-register-form.type";
import Alertpop from "./ui/alertpop";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumb";
import UseGetApp from "@/hooks/UseGetApp";
import { useEffect, useState } from "react";
import UseGetUserById from "@/hooks/UseGetUserById";
interface AppItem {
  _id: number;
  app_name: string;
}
const AdminRegistrationForm = (props: { id: number }) => {
  const is_activeOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
    // Add more options as needed
  ];
  const user_roleOptions = [
    { value: "0", label: "Admin" },
    { value: "1", label: "Users" },
    { value: "2", label: "Admin Users" },
    // Add more options as needed
  ];
  const [appList, setAppList] = useState([]);
  const [app_id, setApp_id] = useState("");
  const [username, setUser_name] = useState("");
  const [role_id, setRole_id] = useState("0");
  const [is_active, setis_active] = useState("1");
  const [email, setEmail] = useState("");
  const [is_FormUpdate, setis_FormUpdate] = useState(false);
  const userid = props.id;
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  const confirm_password = watch("confirm_password");
  let url;
  if (is_FormUpdate == true) {
    url = getEndpointUrl("/auth" + "/" + userid);
  } else {
    if (role_id == "0") {
      url = getEndpointUrl(ENDPOINTS.adminRegister);
    } else {
      url = getEndpointUrl(ENDPOINTS.appsuser + ENDPOINTS.signup);
    }
  }
  const { isLoading, error, success, submitForm, updateForm } =
    UseFormAdminRegister<AdminRegisterFormData>({
      url: url,
    });

  const onSubmit = ((data: AdminRegisterFormData) => {
    if (password == confirm_password) {
      delete data.confirm_password;
      if (userid != 0 && userid != null && userid != undefined) {
        updateForm(data);
      } else {
        submitForm(data);
      }
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
      label: PATH.UsersList.name,
      path: PATH.UsersList.path,
    },
    {
      label: is_FormUpdate ? "Update User" : "Add User",
      path: "",
    },
  ];
  const fetchData = async () => {
    try {
      const appurl = getEndpointUrl(ENDPOINTS.apps);
      const resultApp = await UseGetApp(appurl);
      const AppOption = resultApp?.data?.result?.result
        ? resultApp?.data?.result?.result.map((item: AppItem) => ({
            label: item.app_name,
            value: item._id,
          }))
        : [];
      setAppList(AppOption);
      if (userid != 0) {
        const userDetails = await UseGetUserById(userid);
        if (
          userDetails.data.data != undefined &&
          userDetails.data.data != null
        ) {
          setApp_id(userDetails.data.data.app_id);
          setUser_name(userDetails.data.data.username);
          setis_active(userDetails.data.data.is_active);
          setRole_id(userDetails.data.data.role_id);
          setEmail(userDetails.data.data.email);
          setis_FormUpdate(true);
          const initialFormValues: { [key: string]: string } = {
            username: userDetails.data.data.username,
            is_active: userDetails.data.data.is_active,
            app_id: userDetails.data.data.app_id,
            role_id: userDetails.data.data.role_id,
            email: userDetails.data.data.email,
          };
          Object.keys(initialFormValues).forEach((key) => {
            register(key); // Register the field if not already registered
            setValue(key, initialFormValues[key]); // Set the initial value
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // Set loading to false when the data fetch is complete
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
                    htmlFor="is_active"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    User Role
                  </label>
                  <select
                    id="role_id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("role_id", {
                      required: "This field is required.",
                      onChange: (e) => {
                        setRole_id(e.target.value);
                        // Add any other logic you need here
                      },
                    })}
                    defaultValue={role_id || 1}
                  >
                    {user_roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {" "}
                    {errors.role_id?.message as string}
                  </p>
                </div>
                {role_id != "0" && (
                  <div>
                    <label
                      htmlFor="app_id"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      App Name
                    </label>
                    <select
                      id="app_id"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      {...register("app_id", {
                        required: "This field is required.",
                      })}
                      defaultValue={app_id || ""}
                    >
                      <option key={0} value="">
                        {"Select"}
                      </option>
                      {appList.map(
                        (option: { value: number; label: string }) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                )}
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
                      pattern: {
                        value: /\S/,
                        message: "Enter text without empty spaces.",
                      },
                    })}
                    defaultValue={username}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name"
                  />
                  {errors.username?.message as string}
                </div>
                {role_id != "0" ? (
                  <>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...register("email", {
                          required: "This field is required.",
                          pattern: {
                            value: /\S/,
                            message: "Enter text without empty spaces.",
                          },
                        })}
                        defaultValue={email}
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="ex:name@company.com"
                      />
                      {errors.email?.message as string}
                    </div>
                  </>
                ) : (
                  <>
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
                          pattern: {
                            value: /\S/,
                            message: "Enter text without empty spaces.",
                          },
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
                          pattern: {
                            value: /\S/,
                            message: "Enter text without empty spaces.",
                          },
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
                  </>
                )}
                <div>
                  <label
                    htmlFor="is_active"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Status
                  </label>
                  <select
                    id="is_active"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("is_active", {
                      required: "This field is required.",
                    })}
                    defaultValue={is_active || 1}
                  >
                    {is_activeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {errors.is_active?.message as string}
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Loading..."
                    : is_FormUpdate
                      ? "Update an account"
                      : "Create an account"}
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
