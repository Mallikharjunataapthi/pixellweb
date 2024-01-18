"use client";
import Link from "next/link";
import { PATH } from "@/constants/path";
const AdminSidebar = () => {
  const topMenu: Menu = {
    title: "Admin",
    items: [
      { children: PATH.UsersList.name, href: PATH.UsersList.path },
      { children: PATH.CategoryList.name, href: PATH.CategoryList.path },
      { children: PATH.TemplateList.name, href: PATH.TemplateList.path },
      { children: PATH.TagList.name, href: PATH.TagList.path },
      {
        children: PATH.TemplateFeedbackList.name,
        href: PATH.TemplateFeedbackList.path,
      },
      // ... (other menu items)
      {
        title: "Reports",
        subchildren: [
          {
            children: PATH.MostActiveUsers.name,
            href: PATH.MostActiveUsers.path,
          },
          {
            children: PATH.MostUsedTemplates.name,
            href: PATH.MostUsedTemplates.path,
          },
        ],
      },
    ],
  };

  return (
    <>
      <SidebarMenu {...topMenu} />
    </>
  );
};
const SidebarMenu = ({ title, items }: Menu) => {
  const renderMenuItem = (item: SidebarMenuItem, idx: number) => (
    <Link
      target={item.hasExternalLink ? "_blank" : ""}
      className="text-blue-350 hover:text-black block text-sm ml-2"
      key={idx}
      href={item.href}
    >
      {item.children}
    </Link>
  );

  const renderSubMenu = (submenu: SubMenu, idx: number) => (
    <div key={idx}>
      <h5 className="font-semibold">{submenu.title}</h5>
      <div className="space-y-[0.62rem] pb-[0.62rem]">
        {submenu.subchildren &&
          submenu.subchildren.map((subItem, subIdx) =>
            renderMenuItem(subItem, subIdx),
          )}
      </div>
    </div>
  );
  return (
    <div className="space-y-[0.62rem] pb-[0.62rem] ">
      <h4 className="font-bold">{title}</h4>
      {items.map((item, idx) =>
        "subchildren" in item
          ? renderSubMenu(item, idx)
          : renderMenuItem(item, idx),
      )}
    </div>
  );
};

type Menu = {
  title: string;
  items: (SidebarMenuItem | SubMenu)[];
};

type SubMenu = {
  title: string;
  subchildren: SidebarMenuItem[];
};
type SidebarMenuItem = {
  hasExternalLink?: boolean;
  children: string;
  href: string;
  title?: string;
};
export default AdminSidebar;
