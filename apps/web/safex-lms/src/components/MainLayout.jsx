import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const MainLayout = () => {
  return (
    <div className=''>
      <NavBar />
      <div className='flex'>
        <SideBar />
        <div className='grow'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
