import { useState } from "react";
import { UseLoginProps } from "@/types/user.type";
import axios from "axios";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";
import { useUserContext } from "@/context/store";
import Cookies from "js-cookie";

interface UseLoginResult {
  isLoading: boolean;
  error: string;
  success: boolean;
  login: ({ email, password }: UseLoginProps) => Promise<void>;
}

const useLogin = (): UseLoginResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { setUser } = useUserContext();

  const login = async ({ email, password }: UseLoginProps): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      const firebaseUser = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await firebaseUser.user.getIdToken();

      const res = await axios.post(getEndpointUrl(ENDPOINTS.login), {
        idToken,
      });
      setSuccess(true);
      Cookies.set("token", idToken);
      setUser(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
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

  return { isLoading, error, success, login };
};

export default useLogin;
