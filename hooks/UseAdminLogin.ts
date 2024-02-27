import { useState } from "react";
import { AdminLoginFormData } from "@/types/admin-login-form.type";
import axios from "axios";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import Cookies from "js-cookie";
import { useAdminContext } from "@/context/storeAdmin";
interface UseAdminLoginResult {
  isLoading: boolean;
  error: string;
  success: boolean;
  adminlogin: ({ username, password }: AdminLoginFormData) => Promise<void>;
}

const UseAdminLogin = (): UseAdminLoginResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const adminlogin = async ({
    username,
    password,
  }: AdminLoginFormData): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.get(getEndpointUrl(ENDPOINTS.adminlogin), {
        params: {
          username: username,
          password: password,
        },
      });

      if (res && res.data.message === "Login successful") {
        setSuccess(true);
      } else {
        Cookies.remove("admintoken");
      }

      //  Cookies.set("token", idToken);
      if (res.data && res.data.access_token !== "") {
        Cookies.set("admintoken", res.data.access_token);
        Cookies.set("adminId", res.data.user_id ); // Assuming you get user data after login, adjust accordingly
      } else {
        Cookies.remove("admintoken");
        Cookies.remove("adminId");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Cookies.remove("admintoken");
      Cookies.remove("adminId");
      if (axios.isAxiosError(error)) {
        console.log(error);

        console.error(error.response?.data);
        setError(
          error.response?.data?.message ||
            "An error occurred while submitting the form",
        );
      } else {
        if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/invalid-login-credentials"
        ) {
          setError("Email or password is not correct.");
        } else {
          console.error(error);
          setError("An error occurred while submitting the form");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, success, adminlogin };
};

export default UseAdminLogin;
