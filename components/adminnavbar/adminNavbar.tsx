"use client";

import Image from "next/image";
import steeringWheel from "@/public/icons/steeringWheel.svg";
import tada from "@/public/icons/tada.svg";
import xdsLogo from "@/public/xds-logo.svg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAdminContext } from "@/context/storeAdmin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const AdminNavbar = () => {
  const { handleAdminSignOut } = useAdminContext();
  return (
    <nav className="bg-gradient-to-r from-yellow-300 to-orange-300 border-gray-200 dark:bg-gray-900 w-full">
      <div className="flex flex-wrap items-center justify-between p-2 h-[2rem]">
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
                <AvatarFallback></AvatarFallback>
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
              <DropdownMenuItem onClick={handleAdminSignOut}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
