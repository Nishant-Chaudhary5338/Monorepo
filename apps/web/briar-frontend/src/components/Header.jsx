import React from "react";
import { LiaSave } from "react-icons/lia";
import { AiOutlineClear, AiOutlineDoubleRight } from "react-icons/ai";
import { BsFillClipboard2PlusFill } from "react-icons/bs";
import { AiFillFolderOpen } from "react-icons/ai";
import { RiToolsFill } from "react-icons/ri";
import { MdHelp } from "react-icons/md";

import { CiViewTable } from "react-icons/ci";
import { PiNewspaperClippingThin } from "react-icons/pi";
const Header = () => {
  return (
    <div className='bg-[#71a311] pt-1 flex justify-around border border-teal-[#71a311]'>
      <div className='flex flex-col my-1 items-center'>
        <div className='flex space-x-4 items-center'>
          <div className='space-y-1'>
            <PiNewspaperClippingThin
              size={30}
              color='#b4ed47'
              className='bg-white p-1 rounded-full'
            />
            <p className='text-white'>New</p>
          </div>
          <div className='space-y-1'>
            <LiaSave
              size={30}
              color='#b4ed47'
              className='bg-white p-1 rounded-full'
            />
            <p className='text-white'>Save</p>
          </div>
          <div className='space-y-1'>
            <AiOutlineClear
              size={30}
              color='#b4ed47'
              className='bg-white p-1 rounded-full'
            />
            <p className='text-white'>Clear</p>
          </div>
        </div>
      </div>
      <div className='space-y-1 my-1 flex flex-col items-center'>
        <CiViewTable
          size={30}
          color='#b4ed47'
          className='bg-white p-1 rounded-full'
        />
        <p className='text-white'>View</p>
      </div>
      <div className='space-y-1 flex my-1 flex-col items-center'>
        <BsFillClipboard2PlusFill
          size={30}
          color='#b4ed47'
          className='bg-white p-1 rounded-full'
        />
        <p className='text-white'>Additional</p>
      </div>
      <div className='space-y-1 my-1 flex flex-col items-center'>
        <AiFillFolderOpen
          size={30}
          color='#b4ed47'
          className='bg-white p-1 rounded-full'
        />
        <p className='text-white'>File</p>
      </div>
      <div className='space-y-1 my-1 flex flex-col items-center'>
        <RiToolsFill
          size={30}
          color='#b4ed47'
          className='bg-white p-1 rounded-full'
        />
        <p className='text-white'>Tools</p>
      </div>
      <div className='space-y-1 my-1 flex flex-col items-center'>
        <MdHelp
          size={30}
          color='#b4ed47'
          className='bg-white p-1 rounded-full'
        />
        <p className='text-white'>Help</p>
        <div className='pt-1'></div>
      </div>
    </div>
  );
};

export default Header;

/*
AiOutlineDoubleRight
*/
