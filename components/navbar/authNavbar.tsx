"use client";

import Image from "next/image";
import steeringWheel from "@/public/icons/steeringWheel.svg";
import tada from "@/public/icons/tada.svg";
import xdsLogo from "@/public/xds-logo.svg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUserContext } from "@/context/store";
import SubNavbar from "./subNavbar";
import { PATH } from "@/constants/path";

const AuthNavbar = () => {
  const { user, handleSignOut } = useUserContext();

  return (
    <nav className="bg-gradient-to-r from-yellow-300 to-orange-300 border-gray-200 dark:bg-gray-900 w-full">
      <div className="flex flex-wrap items-center justify-between p-2 h-[3rem]">
        <Image
          priority
          src={xdsLogo}
          alt="Logo"
          sizes="100vh"
          style={{ width: "auto", height: "1.5rem" }}
        />
        <div className="flex items-center">
          <Image
            className="mx-3"
            priority
            src={steeringWheel}
            alt="Steering Wheel Icon"
            sizes="100vh"
            style={{ width: "auto", height: "auto" }}
          />
          <Image
            className="mx-3"
            priority
            src={tada}
            alt="Tada Icon"
            sizes="100vw"
            style={{ width: "auto", height: "auto" }}
          />

          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <Avatar className="mx-1">
                <AvatarFallback>
                  {getAliasName(
                    user?.firstName as string,
                    user?.lastName as string,
                  )}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="overflow-visible mr-1"
              side="left"
              collisionPadding={5}
            >
              <DropdownMenuLabel className="text-sm font-bold min-w-[300px] relative p-4">
                My Account
                <div className="absolute right-[-3%] top-1/4 transform h-0 w-0 border-y-8 border-y-transparent border-l-[11px] border-l-white"></div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="m-0" />
              <Link href={PATH.PERSONAL_SETTINGS.path}>
                <DropdownMenuItem>
                  {PATH.PERSONAL_SETTINGS.name}
                </DropdownMenuItem>
              </Link>
              <Link href={PATH.SUBSCRIPTION.path(user?.email)} target="_blank">
                <DropdownMenuItem>
                  {PATH.SUBSCRIPTION.dropdownName}
                </DropdownMenuItem>
              </Link>
              <Link href="#">
                <DropdownMenuItem>Edit Company Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleSignOut}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div>
        <SubNavbar />
      </div>
    </nav>
  );
};

export default AuthNavbar;

const getAliasName = (firstName: string, lastName: string) => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};
