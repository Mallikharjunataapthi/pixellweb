"use client";
import AdminNavbar from "./adminNavbar";
import UnauthenticatedNavbar from "./unauthenticatedNavbar";
import { useUserContext } from "@/context/store";

const Navbar = () => {
  const { user } = useUserContext();
  return user ? <AdminNavbar /> : <UnauthenticatedNavbar />;
};

export default Navbar;
