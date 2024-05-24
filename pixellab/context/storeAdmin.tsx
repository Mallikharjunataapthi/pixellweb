"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import Spinner from "@/components/spinner";

type Admin = {
  admintoken: string;
};

interface AdminContextProps {
  admin: Admin | null;
  setAdmin: Dispatch<SetStateAction<Admin | null>>;
  mutate: () => Promise<void>;
  handleAdminSignOut: () => Promise<void>;
}

const AdminContext = createContext<AdminContextProps>({
  admin: null,
  setAdmin: () => null,
  mutate: async () => {},
  handleAdminSignOut: async () => {},
});

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const admintoken = Cookies.get("admintoken");
  const [loading, setLoading] = useState(true);

  const mutate = async () => {
    try {
      // const response = await axios.post(getEndpointUrl(ENDPOINTS.verifyToken), {
      //   idToken: admintoken,
      // });
      const admintoken = Cookies.get("admintoken");

      if (admintoken) {
        // Assuming you need to create an Admin object using the token
        const adminData: Admin = {
          admintoken: admintoken,
        };

        setAdmin(adminData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignOut = async () => {
    try {
      setAdmin(null);
      Cookies.remove("admintoken");
    } catch (e) {
      console.log(e);
    } finally {
      setAdmin(null);
      Cookies.remove("admintoken");
    }
  };

  useEffect(() => {
    admintoken ? mutate() : setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admintoken]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <AdminContext.Provider
      value={{ admin, setAdmin, mutate, handleAdminSignOut }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
