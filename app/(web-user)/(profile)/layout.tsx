import Sidebar from "@/components/sidebar";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function MyProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-grow flex-col">
      <div className="h-full flex flex-grow">
        <div className="h-full shadow shadow-gray-500 w-[15rem]">
          <Sidebar />
        </div>
        <div>{children}</div>
        <ToastContainer position="bottom-right" style={{ width: "350px" }} />
      </div>
    </div>
  );
}
