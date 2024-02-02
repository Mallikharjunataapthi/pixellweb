"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { TagFormData } from "@/types/tag-form.type";
import { useEffect, useState } from "react";
import UseGetTagById from "@/hooks/UseGetTagById";
import { redirect } from "next/navigation";
import { PATH } from "@/constants/path";
import LabelInput from "@/components/labelInput";
import useFormTag from "@/hooks/useFormtag";
import Breadcrumbs from "@/components/breadcrumb";
import { useAdminContext } from "@/context/storeAdmin";
import Alertpop from "./ui/alertpop";
import UseGetApp from "@/hooks/UseGetApp";
import Spinner from "./spinner";
interface AppItem {
  _id: number;
  app_name: string;
}
const TagForm = (props: { id: number }) => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  const requiredMessage = "This field is required.";
  const [tag_name, settag_name] = useState("");
  const [oldTagName, setoldTagName] = useState("");
  const [is_active, setis_active] = useState("");
  const [is_FormUpdate, setis_FormUpdate] = useState(false);
  const [appList, setAppList] = useState([]);
  const [app_id, setApp_id] = useState("");
  const [loading, setLoading] = useState(true);
  const tagid = props.id;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm();
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
      if (tagid != 0) {
        const tagDetails = await UseGetTagById(tagid);
        if (tagDetails.data.data != undefined && tagDetails.data.data != null) {
          settag_name(tagDetails.data.data.tag_name);
          setoldTagName(tagDetails.data.data.tag_name);
          setis_active(tagDetails.data.data.is_active);
          setApp_id(tagDetails.data.data.app_id);
          setis_FormUpdate(true);
          const initialFormValues: { [key: string]: string | number } = {
            tag_name: tagDetails.data.data.tag_name,
            is_active: tagDetails.data.data.is_active,
            app_id: tagDetails.data.data.app_id,
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
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  let url;
  if (is_FormUpdate == true) {
    url = getEndpointUrl(ENDPOINTS.templates + ENDPOINTS.updateTag(tagid));
  } else {
    url = getEndpointUrl(ENDPOINTS.tags);
  }
  const { isLoading, error, success, submitForm, updateForm } =
    useFormTag<TagFormData>({
      url: url,
    });

  const onSubmit = ((data: TagFormData) => {
    if (tagid != 0 && tagid != null && tagid != undefined) {
      data.oldTagName = oldTagName;
      updateForm(data);
    } else {
      submitForm(data);
    }
  }) as SubmitHandler<FieldValues>;

  const is_activeOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
    // Add more options as needed
  ];

  const breadcrumbItems = [
    {
      label: PATH.ADMINHOME.name,
      path: PATH.ADMINHOME.path,
    },
    {
      label: PATH.TagList.name,
      path: PATH.TagList.path,
    },
    {
      label: is_FormUpdate ? "Update Tag" : PATH.Addtag.name,
      path: PATH.Addtag.path,
    },
  ];
  if (success) {
    redirect(PATH.TagList.path);
  }
  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
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
                {is_FormUpdate ? "Update Tag " : "Add Tag "}
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
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
                    defaultValue={app_id}
                  >
                    <option key={0} value="">
                      {"Select"}
                    </option>

                    {appList.map((option: { value: number; label: string }) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {errors.app_id?.message as string}
                  </p>
                </div>
                <LabelInput
                  register={register("tag_name", {
                    required: requiredMessage,
                    pattern: {
                      value: /\S/,
                      message: "Enter text without empty spaces.",
                    },
                  })}
                  defaultValue={tag_name || ""}
                  label="Tag Name"
                  errorMessage={errors.tag_name?.message as string}
                />
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
                  {errors.is_active?.message as string}
                </div>
                {success && !error
                  ? is_FormUpdate
                    ? "Tag Updated Successfully!"
                    : "Tag Added Successfully!"
                  : ""}
                {error && (
                  <p className="font-medium text-red-500 text-xs mt-1">
                    <Alertpop error={error} colors="failure" />
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                  disabled={(!is_FormUpdate ? !isValid : "") || isLoading}
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

export default TagForm;
