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
import { RoleCode } from "@/constants/roleCode";
import Cookies from "js-cookie";
import { ENDPOINTS, getEndpointUrl } from "@/constants/endpoints";
import axios from "axios";
import Spinner from "@/components/spinner";
import { auth, signOut } from "@/services/firebase";
import { IBackupPersonalContact } from "@/types/backup-personal-contact.type";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  linkedInUrl: string;
  companyId: number;
  userRoles: RoleCode[];
  backupPersonalContact: IBackupPersonalContact;
};

interface UserContextProps {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  mutate: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => null,
  mutate: async () => {},
  handleSignOut: async () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);

  const mutate = async () => {
    try {
      const response = await axios.post(getEndpointUrl(ENDPOINTS.verifyToken), {
        idToken: token,
      });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.log(e);
    } finally {
      setUser(null);
      Cookies.remove("token");
    }
  };

  useEffect(() => {
    token ? mutate() : setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, mutate, handleSignOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
