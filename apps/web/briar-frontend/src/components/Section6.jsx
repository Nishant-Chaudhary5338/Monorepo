import React from "react";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";

const Section6 = ({ data }) => {
  return (
    <div className='space-y-1 pb-4'>
      <div className='flex space-x-8 items-center sm:space-x-[56px]'>
        <span>Cost Center</span>
        <div className='flex space-x-1'>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
            {data?.ZcostCentre}
          </span>
          <PiMagnifyingGlassDuotone
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
        </div>
      </div>
      <div className='flex space-x-6 items-center sm:space-x-[74px]'>
        <span>Location</span>
        <div className='flex space-x-1'>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
            {data?.FunctLoc}
          </span>
          <PiMagnifyingGlassDuotone
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
        </div>
      </div>
      <div className='flex space-x-12 items-center sm:space-x-[82px]'>
        <span>Tech ID</span>
        <div className='flex space-x-1'>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
          <PiMagnifyingGlassDuotone
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
        </div>
      </div>
      <div className='flex space-x-10 items-center sm:space-x-[72px]'>
        <span>Terms ID</span>
        <div className='flex space-x-1'>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
          <PiMagnifyingGlassDuotone
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
        </div>
      </div>
      <div className='flex space-x-[22px] items-center sm:space-x-[54px]'>
        <span>Currency ID</span>
        <div className='flex space-x-1'>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
          <PiMagnifyingGlassDuotone
            size={30}
            color='#b4ed47'
            className='border p-[2px] border-[#b4ed47]  rounded-md'
          />
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40'></span>
        </div>
      </div>
    </div>
  );
};

export default Section6;
