"use client";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { TemplateFormData } from "@/types/template-form.type";
import { useEffect, useRef, useState } from "react";
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
import UseGetAdminUsers from "@/hooks/UseGetAdminUsers";
interface AppItem {
  _id: number;
  app_name: string;
}
interface CategoryItem {
  _id: number;
  cat_name: string;
}
interface UserItem {
  _id: number;
  username: string;
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
  const [base_image_path, setBase_image_path] = useState("");
  const [purchase_url, setPurchase_url] = useState("");
  const [api_to_call, setApi_to_call] = useState("template_creation");
  const [user_id, setUser_id] = useState("");
  const [userlist, setUserlist] = useState([]);
  const [aspect_ratio_x, setAspect_ratio_x] = useState(3);
  const [aspect_ratio_y, setAspect_ratio_y] = useState(4);
  const user_name = useRef("");
  const temp_user_id = useRef("");
  const user_parent_temp_id = useRef("");
  const prevapp_id = useRef("");
  const isFetching = useRef(false); // Ref to track fetching status
  const [prompt, setprompt] = useState("");
  const [style_name, setstyle_name] = useState("none");
  const [identitynet_strength_ratio, setidentitynet_strength_ratio] =
    useState(0.7);
  const [adapter_strength_ratio, setadapter_strength_ratio] = useState(0.8);
  const [num_steps, setnum_steps] = useState(0);
  const [seed, setseed] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const getCatTag = async (appid: string) => {
    if (appid != "") {
      const userURL =
        getEndpointUrl(ENDPOINTS.users + ENDPOINTS.adminusers) +
        "?" +
        "app_id=" +
        appid;
      const resultUser = await UseGetAdminUsers(userURL);
      const UserOption = resultUser?.data?.data?.data
        ? resultUser?.data?.data?.data.map((item: UserItem) => ({
            label: item.username,
            value: item._id,
          }))
        : [];
      setUserlist(UserOption);
      if (prevapp_id.current == appid && user_parent_temp_id.current != "") {
        UserOption.push({
          label: user_name.current,
          value: temp_user_id.current,
        });
      }
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
        getEndpointUrl(ENDPOINTS.tags + ENDPOINTS.getActiveList()) +
        "/" +
        appid;
      const resultTag = await UseGetCategory(tagurl);
      const tagsOptions: string[] = [];
      resultTag?.data?.data?.result.forEach((item: TagItem) => {
        tagsOptions.push(item.tag_name);
      });
      setTagList(tagsOptions);
    } else {
      setUserlist([]);
      setTagList([]);
      setCategoryList([]);
    }
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
          setis_FormUpdate(true);
          setApp_id(templateDetails.data.data.app_id);
          prevapp_id.current = templateDetails.data.data.app_id;
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
          setBase_image_path(templateDetails.data.data.base_image_path);
          setPurchase_url(templateDetails.data.data.purchase_url);
          setApi_to_call(templateDetails.data.data.api_to_call);
          setUser_id(templateDetails.data.data.user_id._id);
          temp_user_id.current = templateDetails.data.data.user_id._id;
          user_name.current = templateDetails.data.data?.user_id?.username;
          user_parent_temp_id.current = templateDetails.data.data?.template_id
            ? templateDetails.data.data?.template_id
            : "";
          setAspect_ratio_x(templateDetails.data.data.aspect_ratio_x);
          setAspect_ratio_y(templateDetails.data.data.aspect_ratio_y);
          setprompt(templateDetails.data.data.prompt);
          setstyle_name(templateDetails.data.data.style_name);
          setidentitynet_strength_ratio(
            templateDetails.data.data.identitynet_strength_ratio,
          );
          setadapter_strength_ratio(
            templateDetails.data.data.adapter_strength_ratio,
          );
          setnum_steps(templateDetails.data.data.num_steps);
          setseed(templateDetails.data.data.seed);
          await getCatTag(templateDetails.data.data.app_id);
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
            base_image_path: templateDetails.data.data.base_image_path,
            purchase_url: templateDetails.data.data.purchase_url,
            api_to_call: templateDetails.data.data.api_to_call.trim(),
            tag_name: defaultValueFormatted,
            user_id: templateDetails.data.data.user_id._id,
            aspect_ratio_x: templateDetails.data.data.aspect_ratio_x,
            aspect_ratio_y: templateDetails.data.data.aspect_ratio_y,
            prompt: templateDetails.data.data.prompt,
            style_name: templateDetails.data.data.style_name,
            identitynet_strength_ratio:
              templateDetails.data.data.identitynet_strength_ratio,
            adapter_strength_ratio:
              templateDetails.data.data.adapter_strength_ratio,
            num_steps: templateDetails.data.data.num_steps,
            seed: templateDetails.data.data.seed,
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
    if (isFetching.current) return; // If already fetching, exit the function
    isFetching.current = true;
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
    //const adminId = Cookies.get("adminId");
    // Append string data to the FormData object
    formData.append("cat_id", data.cat_id);
    formData.append("template_name", data.template_name);
    formData.append("is_active", data.is_active.toString());
    formData.append("is_free", data.is_free);
    formData.append("feedType", data.feedType);
    formData.append("app_id", data.app_id);
    formData.append("template_desc", data.template_desc);
    formData.append("base_image_path", data.base_image_path);
    formData.append("purchase_url", data.purchase_url);
    formData.append("api_to_call", data.api_to_call);
    formData.append("aspect_ratio_x", ` ${data.aspect_ratio_x}`);
    formData.append("aspect_ratio_y", ` ${data.aspect_ratio_y}`);
    formData.append("prompt", ` ${data.prompt}`);
    formData.append("style_name", ` ${data.style_name}`);
    formData.append(
      "identitynet_strength_ratio",
      ` ${data.identitynet_strength_ratio}`,
    );
    formData.append(
      "adapter_strength_ratio",
      ` ${data.adapter_strength_ratio}`,
    );
    formData.append("num_steps", ` ${data.num_steps}`);
    formData.append("seed", ` ${data.seed}`);
    if (data.user_id) {
      formData.append("user_id", data.user_id);
    }
    const outputArray: string[] = data?.tag_name.map((item) => item.value);
    outputArray.forEach((item, index) => {
      formData.append(`tags[${index}]`, item);
    });
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
    { value: "Reward", label: "Reward" },
    // Add more options as needed
  ];
  const api_to_callOptions = [
    { value: "ai_avathar_faceswap", label: "ai_avathar_faceswap" },
    { value: "faceswap_image", label: "faceswap_image" },
    { value: "faceswap_video", label: "faceswap_video" },
    { value: "template_creation", label: "template_creation" },
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
                    id="app_id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={app_id}
                    {...register("app_id", {
                      required: "This field is required.",
                      onChange: (e) => {
                        getCatTag(e.target.value);
                        // Add any other logic you need here
                      },
                    })}
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
                    User Name
                  </label>
                  <select
                    id="user_id"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("user_id", {
                      required: false,
                    })}
                    defaultValue={user_id}
                  >
                    <option key={0} value="">
                      {"Select"}
                    </option>

                    {userlist.map(
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
                    pattern: {
                      value: /\S/,
                      message: "Enter text without empty spaces.",
                    },
                  })}
                  defaultValue={template_name || ""}
                  label="Template Name"
                  errorMessage={errors.template_name?.message as string}
                />
                <p className="font-bold text-sm">Before Image/Video</p>
                <div>
                  <ImagesUploadPreview
                    id="before_image_url"
                    buttonLabel="Add Before Image/Video"
                    removeLabel="Remove Before Image/Video"
                    previewShape="rectangle"
                    defaultValue={before_image_url}
                    isLoading={before_image_loading}
                    register={register}
                    setValue={setValue}
                    requiredimg={true}
                  />
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {errors.before_image_url?.message as string}
                  </p>
                </div>
                <p className="font-bold text-sm">After Image/Video</p>
                <div>
                  <ImagesUploadPreview
                    id="after_image_url"
                    previewShape="rectangle"
                    buttonLabel="Add After Image/Video "
                    removeLabel="Remove After Image/Video"
                    defaultValue={after_image_url}
                    isLoading={after_image_loading}
                    register={register}
                    setValue={setValue}
                    requiredimg={true}
                  />
                  <p className="font-medium text-red-500 text-xs mt-1">
                    {errors.after_image_url?.message as string}
                  </p>
                </div>
                <LabelInput
                  register={register("aspect_ratio_x", {})}
                  defaultValue={aspect_ratio_x || ""}
                  label="Aspect Ratio X"
                />
                <LabelInput
                  register={register("aspect_ratio_y", {})}
                  defaultValue={aspect_ratio_y || ""}
                  label="Aspect Ratio Y"
                />
                <LabelInput
                  register={register("purchase_url", {})}
                  defaultValue={purchase_url || ""}
                  label="Purchase url"
                />
                <div>
                  <Label htmlFor={"prompt"}>Prompt</Label>
                  <Textarea
                    id={"prompt"}
                    defaultValue={prompt}
                    {...register("prompt", {})}
                  />
                </div>
                <LabelInput
                  register={register("style_name", {})}
                  defaultValue={style_name}
                  label="Style Name"
                />
                <LabelInput
                  register={register("identitynet_strength_ratio", {})}
                  defaultValue={identitynet_strength_ratio}
                  label="Identitynet Strength Ratio"
                />
                <LabelInput
                  register={register("adapter_strength_ratio", {})}
                  defaultValue={adapter_strength_ratio}
                  label="Adapter Strength Ratio"
                />
                <LabelInput
                  register={register("num_steps", {})}
                  defaultValue={num_steps}
                  label="Num Steps"
                />
                <LabelInput
                  register={register("seed", {})}
                  defaultValue={seed}
                  label="Seed"
                />
                <div>
                  <label
                    htmlFor="feedType"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    API To Call
                  </label>
                  <select
                    id="api_to_call"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("api_to_call", {
                      required: "This field is required.",
                    })}
                    defaultValue={api_to_call}
                  >
                    {api_to_callOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.api_to_call?.message as string}
                </div>
                <LabelInput
                  register={register("base_image_path", {})}
                  defaultValue={base_image_path || ""}
                  label="Base Image Path"
                />
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
                  disabled={isLoading}
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
