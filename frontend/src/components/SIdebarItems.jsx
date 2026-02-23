import {
  LuLayoutDashboard
} from "react-icons/lu";
import { IoDocumentsOutline, IoFlash } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";

import { NavLink } from "react-router-dom";

import { MdAdminPanelSettings } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

const SIDEBAR_ITEMS = [
  {
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
    roles: ["student"]
  },
  {
    label: "Documents",
    icon: IoDocumentsOutline,
    path: "/documents",
    roles: ["student"]
  },
  {
    label: "FlashCards",
    icon: IoFlash,
    path: "/flashcards",
    roles: ["student"]
  },

  // ADMIN ONLY
  {
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/admin/dashboard",
    roles: [ "admin"]
  },
  {
    label: "All Users",
    icon: FaUsers,
    path: "/admin/users",
    roles: ["admin"]
  },
  {
    label: "All Documents",
    icon: MdAdminPanelSettings,
    path: "/admin/documents",
    roles: ["admin"]
  },
  // Student and Admin 
  {
    label: "Profile",
    icon: FaRegUser,
    path: "/user/profile",
    roles: ["student","admin"]
  },
];



const SidebarItem = ({ icon: Icon, label, path, onClick }) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `relative overflow-hidden border-none flex items-center gap-2 rounded-xl border p-2 text-sm transition-colors group
        ${isActive ? "bg-orange-500 text-white shadow-md"  : "text-slate-300 bg-slate-700/40"}`
      }
    >
    
      <span
        className={`absolute inset-0 bg-orange-500 transition-transform duration-300 origin-left
        ${"group-hover:scale-x-100"} scale-x-0`}
      />

     
      <span className="relative z-10 text-base  group-hover:text-white">
        <Icon />
      </span>

      
      <span className="relative z-10 group-hover:text-white">
        {label}
      </span>
    </NavLink>
  );
};

export {SidebarItem, SIDEBAR_ITEMS};
