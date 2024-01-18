"use client";

import Image from "next/image";

const UnauthenticatedNavbar = () => {
  return (
    <nav className="shadow-md shadow-gray-400/90 bg-gradient-to-r from-yellow-300 to-orange-300 border-gray-200 dark:bg-gray-900 w-full h-[4.75rem]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-center mx-auto p-5">
        <Image
          priority
          src="/xds-logo.svg"
          alt="Logo"
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: "auto", height: "2.25rem" }}
          loader={({ src, width }) => {
            return `${src}?w=${width}`;
          }}
        />
      </div>
    </nav>
  );
};

export default UnauthenticatedNavbar;
