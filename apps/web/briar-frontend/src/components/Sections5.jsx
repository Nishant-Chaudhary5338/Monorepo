import React from "react";
import SquareRadioButton from "../small-components/SquareRadioButton";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { IoMdCopy } from "react-icons/io";

const Section5 = () => {
  return (
    <div className='space-y-2'>
      <div className='flex space-x-4 sm:space-x-20'>
        <span>Problem</span>
        <div className='flex space-x-1'>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
          <PiMagnifyingGlassDuotone
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <IoMdCopy
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
        </div>
      </div>
      <div className='flex space-x-8 sm:space-x-[94px]'>
        <span>Cause</span>
        <div className='flex space-x-1'>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
          <PiMagnifyingGlassDuotone
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <IoMdCopy
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
        </div>
      </div>
      <div className='flex space-x-[28px] sm:space-x-[92px]'>
        <span>Repair</span>
        <div className='flex space-x-1'>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
          <PiMagnifyingGlassDuotone
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <IoMdCopy
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
        </div>
      </div>
      <div className='space-x-20 flex'>
        <div className='flex items-center space-x-2'>
          <span>Related to Internal Project</span>
          <SquareRadioButton />
        </div>
        <div className='items-center flex space-x-2'>
          <span>Shutdown</span>
          <SquareRadioButton />
        </div>
      </div>
    </div>
  );
};

export default Section5;
