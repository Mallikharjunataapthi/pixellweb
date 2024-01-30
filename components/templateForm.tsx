"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { TemplateFormData } from "@/types/template-form.type";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { PATH } from "@/constants/path";
import LabelInput from "@/components/labelInput";
import Breadcrumbs from "@/components/breadcrumb";
import ImagesUploadPreview from "./ui/imagesUploadPreview";
import UseGetCategory from "@/hooks/UseGetCategory";
import UseGetTemplateById from "@/hooks/UseGetTemplateById";
import Selectmultiple from "./ui/selectmultiple";
import UseFormTemplate from "@/hooks/UseFormTemplate";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useAdminContext } from "@/context/storeAdmin";
import Alertpop from "./ui/alertpop";
import UseGetApp from "@/hooks/UseGetApp";
interface AppItem {
  _id: number;
  app_name: string;
}
interface CategoryItem {
  _id: number;
  cat_name: string;
}
const TemplateForm = (props: { id: number }) => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  interface TagItem {
    tag_name: string;
  }
  const templateId = props.id;
  const requiredMessage = "This field is required.";
  const [cat_id, setCat_id] = useState("");
  const [template_name, setTemplate_name] = useState("");
  const [before_image_url, setBefore_image_url] = useState("");
  const [after_image_url, setAfter_image_url] = useState("");
  const [is_active, setIs_active] = useState(0);
  const [is_free, setIs_free] = useState("Free");
  const [feedType, setFeedType] = useState("Top");
  const [template_desc, settemplate_desc] = useState("");
  const [after_image_loading, setAfter_image_loading] = useState(false);
  const [before_image_loading, setBefore_image_loading] = useState(false);
  const [categorylist, setCategoryList] = useState([]);
  const [tagList, setTagList] = useState<string[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [is_FormUpdate, setis_FormUpdate] = useState(false);
  const [tagsData, settagsData] = useState<string[] | []>([]);
  const [appList, setAppList] = useState([]);
  const [app_id, setApp_id] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const getCatTag = async (appid: string) => {
    const Categoryurl =
      getEndpointUrl(ENDPOINTS.category + ENDPOINTS.getActiveList()) +
      "/" +
      appid;
    const resultCategory = await UseGetCategory(Categoryurl);
    const CategoryOption = resultCategory?.data?.data?.result
      ? resultCategory?.data?.data?.result.map((item: CategoryItem) => ({
          label: item.cat_name,
          value: item._id,
        }))
      : [];
    setCategoryList(CategoryOption);

    const tagurl =
      getEndpointUrl(ENDPOINTS.tags + ENDPOINTS.getActiveList()) + "/" + appid;
    const resultTag = await UseGetCategory(tagurl);
    const tagsOptions: string[] = [];
    resultTag?.data?.data?.result.forEach((item: TagItem) => {
      tagsOptions.push(item.tag_name);
    });
    setTagList(tagsOptions);
  };
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

      if (templateId != 0) {
        const templateDetails = await UseGetTemplateById(templateId);
        if (
          templateDetails.data.data != undefined &&
          templateDetails.data.data != null
        ) {
          setApp_id(templateDetails.data.data.app_id);
          await getCatTag(templateDetails.data.data.app_id);
          setCat_id(templateDetails.data.data.cat_id);
          setTemplate_name(templateDetails.data.data.template_name);
          setBefore_image_url(templateDetails.data.data.before_image_url);
          setBefore_image_loading(true);
          setAfter_image_url(templateDetails.data.data.after_image_url);
          setAfter_image_loading(true);
          setIs_active(templateDetails.data.data.is_active);
          setIs_free(templateDetails.data.data.is_free);
          setFeedType(templateDetails.data.data.feedType);
          settemplate_desc(templateDetails.data.data.template_desc);
          const tagsdefaultValueOptions: string[] = [];
          templateDetails.data.data.tags.forEach((item: string) => {
            tagsdefaultValueOptions.push(item);
          });
          settagsData(tagsdefaultValueOptions);
          const defaultValueFormatted = templateDetails.data.data.tags
            ? templateDetails.data.data.tags.map((item: string) => ({
                value: item.trim(),
                label: item.trim(),
              }))
            : [];
          setis_FormUpdate(true);
          const initialFormValues: { [key: string]: string } = {
            cat_id: templateDetails.data.data.cat_id,
            app_id: templateDetails.data.data.app_id,
            template_name: templateDetails.data.data.template_name,
            before_image_url:
              templateDetails.data.data.before_image_url.toString(),
            after_image_url:
              templateDetails.data.data.after_image_url.toString(),
            is_active: templateDetails.data.data.is_active,
            is_free: templateDetails.data.data.is_free,
            feedType: templateDetails.data.data.feedType,
            template_desc: templateDetails.data.data.template_desc,
            tag_name: defaultValueFormatted,
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
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  let url;
  if (is_FormUpdate == true) {
    url = getEndpointUrl(ENDPOINTS.templates + "/" + templateId);
  } else {
    url = getEndpointUrl(ENDPOINTS.templates);
  }
  const { isLoading, error, success, templateSubmitForm, templateUpdateForm } =
    UseFormTemplate<TemplateFormData>({
      url: url,
    });

  const onSubmit = ((data: TemplateFormData) => {
    const formData = new FormData();

    // Append string data to the FormData object
    formData.append("cat_id", data.cat_id);
    formData.append("template_name", data.template_name);
    formData.append("is_active", data.is_active.toString());
    formData.append("is_free", data.is_free);
    formData.append("feedType", data.feedType);
    formData.append("app_id", data.app_id);
    formData.append("template_desc", data.template_desc);
    const outputArray: string[] = data?.tag_name.map((item) => item.value);
    outputArray.forEach((item, index) => {
      formData.append(`tags[${index}]`, item);
    });
    console.log(data.tag_name);
    if (
      data.before_image_url?.length != undefined &&
      data.before_image_url?.length > 0
    ) {
      if (data.before_image_url) {
        for (const file of data.before_image_url) {
          formData.append("before_image_url", file);
        }
      }
    }
    if (
      data.after_image_url?.length != undefined &&
      data.after_image_url?.length > 0
    ) {
      if (data.after_image_url) {
        for (const file of data.after_image_url) {
          formData.append("after_image_url", file);
        }
      }
    }
    if (templateId != 0 && templateId != null && templateId != undefined) {
      templateUpdateForm(data, formData);
    } else {
      templateSubmitForm(data, formData);
    }
  }) as SubmitHandler<FieldValues>;

  const is_activeOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
    // Add more options as needed
  ];
  const is_freeOptions = [
    { value: "Pro", label: "Pro" },
    { value: "Free", label: "Free" },
    // Add more options as needed
  ];
  const breadcrumbItems = [
    {
      label: PATH.ADMINHOME.name,
      path: PATH.ADMINHOME.path,
    },
    {
      label: PATH.TemplateList.name,
      path: PATH.TemplateList.path,
    },
    {
      label: is_FormUpdate ? "Update Template" : PATH.AddTemplate.name,
      path: PATH.AddTemplate.path,
    },
  ];
  const FeedOption = [
    { value: "Top", label: "Top" },
    { value: "Trending", label: "Trending" },
    { value: "Recent", label: "Recent" },
  ];
  if (success) {
    redirect(PATH.TemplateList.path);
  }
  if (loading) {
    return <div>Loading...</div>;
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
                {is_FormUpdate ? "Update Template " : "Add Template "}
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form-data"
              >
                <div>
                  <label
                    htmlFor="app_id"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    App Name
                  </label>
                  <select
                    {...register("app_id", {
                      required: "This field is required.",
                    })}
                    onChange={(e) => {
                      getCatTag(e.target.value);
                    }}
                    id="app_id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                <div>
                  <label
                    htmlFor="cat_id"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Category Name
                  </label>
                  <select
                    id="cat_id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("cat_id", {
                      required: "This field is required.",
                    })}
                    defaultValue={cat_id}
                  >
                    <option key={0} value="">
                      {"Select"}
                    </option>

                    {categorylist.map(
                      (option: { value: number; label: string }) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {errors.cat_id?.message as string}
                  </p>
                </div>
                <div>
                  <Selectmultiple
                    id="tag_name"
                    tagsOption={tagList !== undefined ? tagList : []}
                    selectLabel="Tags"
                    register={register}
                    setValue={setValue}
                    defaultValue={
                      tagsData !== undefined && tagsData?.length > 0
                        ? tagsData
                        : []
                    }
                    errorMessage={errors.tag_name?.message as string}
                  ></Selectmultiple>
                </div>

                <LabelInput
                  register={register("template_name", {
                    required: requiredMessage,
                  })}
                  defaultValue={template_name || ""}
                  label="Template Name"
                  errorMessage={errors.template_name?.message as string}
                />
                <p className="font-bold text-sm">Before Image</p>
                <div>
                  <ImagesUploadPreview
                    id="before_image_url"
                    buttonLabel="Add Before Image"
                    removeLabel="Remove Before Image"
                    previewShape="rectangle"
                    defaultValue={before_image_url}
                    isLoading={before_image_loading}
                    register={register}
                    setValue={setValue}
                  />
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {errors.before_image_url?.message as string}
                  </p>
                </div>

                <p className="font-bold text-sm">After Image</p>
                <div>
                  <ImagesUploadPreview
                    id="after_image_url"
                    previewShape="rectangle"
                    buttonLabel="Add After Image "
                    removeLabel="Remove After Image"
                    defaultValue={after_image_url}
                    isLoading={after_image_loading}
                    register={register}
                    setValue={setValue}
                  />
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {errors.after_image_url?.message as string}
                  </p>
                </div>
                <div>
                  <Label htmlFor={"template_desc"}>Json Description</Label>
                  <Textarea
                    id={"template_desc"}
                    defaultValue={template_desc}
                    {...register("template_desc", {})}
                  />
                </div>
                <div>
                  <label
                    htmlFor="feedType"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Feed Type
                  </label>
                  <select
                    id="feedType"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("feedType", {
                      required: "This field is required.",
                    })}
                    defaultValue={feedType}
                  >
                    {FeedOption.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.feedType?.message as string}
                </div>
                <div>
                  <label
                    htmlFor="is_free"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Is Free
                  </label>
                  <select
                    id="is_free"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("is_free", {
                      required: "This field is required.",
                    })}
                    defaultValue={is_free || "Free"}
                  >
                    {is_freeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.is_free?.message as string}
                </div>
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
                    ? "Template Updated Successfully!"
                    : "Template Added Successfully!"
                  : ""}
                {error && (
                  <p className="font-medium text-red-500 text-xs mt-1">
                    <Alertpop error={error} colors="failure" />
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
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

export default TemplateForm;
