import React from "react";
import DropDown from "./DropDown";

const NavBar = () => {
  return (
    <div className="h-14 bg-green-700 w-full flex justify-between items-center px-5 shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/assets/safex.png" className="h-14" alt="Safex" />
        <div className="hidden sm:block h-5 w-px bg-green-500" />
        <span className="hidden sm:block text-green-100 text-sm font-medium">Learning Management System</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-800 rounded-full px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-green-700 text-xs font-bold">N</div>
          <span className="text-green-100 text-sm">Nidhi</span>
        </div>
        <DropDown />
      </div>
    </div>
  );
};

export default NavBar;
