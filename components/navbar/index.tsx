"use client";
import AuthNavbar from "./authNavbar";
import UnauthenticatedNavbar from "./unauthenticatedNavbar";
import { useUserContext } from "@/context/store";

const Navbar = () => {
  const { user } = useUserContext();
  return user ? <AuthNavbar /> : <UnauthenticatedNavbar />;
};

export default Navbar;
