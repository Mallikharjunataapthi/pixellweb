import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface UseFormSubmitProps {
  url: string;
}

interface UseFormSubmitResult<T> {
  isLoading: boolean;
  error: string;
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submitForm: (data: T) => Promise<any>;
  reset: () => void;
}

const useFormUpdate = <T>({
  url,
}: UseFormSubmitProps): UseFormSubmitResult<T> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitForm = async (data: T): Promise<any> => {
    setIsLoading(true);
    setError("");

    try {
      const token = Cookies.get("token");

      const res = await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);

      return res;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setError("An error occurred while submitting the form");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setError("");
  };

  return { isLoading, error, success, submitForm, reset };
};

export default useFormUpdate;
