import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo.svg";
import pf from "../assets/images/Pf.svg";
import { ClipboardList, Landmark, Bell, Settings, LogOut } from "lucide-react";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 font-medium transition-all duration-150
   ${
     isActive
       ? "text-[#2750AE] bg-[#F8FAFC]"
       : "text-[#262626] hover:bg-[#F8FAFC]"
   }`;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-white border-r border-[#E6E6E6] flex flex-col">
      {/* Logo */}
      <div className="px-8 py-8">
        <img src={logo} alt="Logo" className="w-10 h-10" />
      </div>

      {/* User Profile */}
      <div className="px-8 pb-5 border-b border-[#E6E6E6]">
        <div className="flex items-center gap-4">
          <img src={pf} alt="Profile" className="w-10 h-10" />
          <div className="font-Pmed">
            <p className="text-md text-[#262626]">Admin</p>
            <p className="text-sm text-[#737373]">{window.localStorage.getItem("cecgrid-email")}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="font-Pmed text-sm flex-1 px-8 py-5">
        <NavLink to="/app/seating-arrangements" className={navItemClass}>
          <ClipboardList size={20} />
          <span>Seating arrangements</span>
        </NavLink>

        <NavLink to="/app/hall-management" className={navItemClass}>
          <Landmark size={20} />
          <span>Hall Management</span>
        </NavLink>

        <NavLink to="/app/notifications" className={navItemClass}>
          <Bell size={20} />
          <span>Notifications</span>
        </NavLink>

        {/* <NavLink to="/app/settings" className={navItemClass}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink> */}
      </nav>

      {/* Logout */}
      <div className="font-Pmed px-8 py-4 border-t border-[#E6E6E6]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#262626] hover:bg-[#F8FAFC] transition w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
