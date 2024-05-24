import { PATH } from "@/constants/path";
import Link from "next/link";

const SubNavbar = () => {
  return (
    <div className="bg-orange-400 h-[2.25rem] font-bold flex justify-center items-center gap-4 text-sm">
      <Link href={PATH.HOME.path}>{PATH.HOME.name}</Link>
      <Link href="#">Browse Service Providers</Link>
      <Link href="#">My Opportunities</Link>
    </div>
  );
};

export default SubNavbar;
