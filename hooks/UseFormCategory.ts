import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
interface UseFormAdminSubmitProps {
  url: string;
}

interface UseFormAdminSubmitResult<T> {
  isLoading: boolean;
  error: string;
  success: boolean;
  submitForm: (formData: any) => Promise<void>;
  updateForm: (formData: any) => Promise<void>;
}

const UseFormCategory = <T>({
  url,
}: UseFormAdminSubmitProps): UseFormAdminSubmitResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const admintoken = Cookies.get("admintoken");
  const submitForm = async (formData: any): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${admintoken}`,
          // Add any other headers if needed
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
  const updateForm = async (formData: any): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      await axios.patch(url, formData, {
        headers: {
          Authorization: `Bearer ${admintoken}`,
          // Add any other headers if needed
        },
      });
      setSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error(error.response.data);
        //setError(error.response.data.message);
        let errorMessage: string;

        if (typeof error.response.data === "string") {
          errorMessage = error.response.data; // Handle string error
        } else if (error.response.data.message.codeName == "DuplicateKey") {
          errorMessage = "Duplicate";
        } else if (error.response.data.message == "Category already exists") {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = "An error occurred while submitting the form";
        }

        setError(errorMessage);
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
  return { isLoading, error, success, submitForm, updateForm };
};

export default UseFormCategory;
