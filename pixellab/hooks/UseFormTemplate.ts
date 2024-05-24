import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
interface UseFormAdminTemplateSubmitProps {
  url: string;
}

interface UseFormAdminTemplateSubmitResult<T> {
  isLoading: boolean;
  error: string;
  success: boolean;
  templateSubmitForm: (data: T, formData: any) => Promise<void>;
  templateUpdateForm: (data: T, formData: any) => Promise<void>;
}

const UseFormTemplate = <T>({
  url,
}: UseFormAdminTemplateSubmitProps): UseFormAdminTemplateSubmitResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const admintoken = Cookies.get("admintoken");
  const templateSubmitForm = async (data: T, formData: any): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      await axios.post(url, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${admintoken}`,
        },
      });
      setSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error(error.response.data);
        setError(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
        setError("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", error.message);
        setError("An error occurred while submitting the form");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const templateUpdateForm = async (data: T, formData: any): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      await axios.patch(url, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${admintoken}`,
        },
      });
      setSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error(error.response.data);
        setError(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        console.error(error.request);
        setError("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error", error.message);
        setError("An error occurred while submitting the form");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, error, success, templateSubmitForm, templateUpdateForm };
};

export default UseFormTemplate;
