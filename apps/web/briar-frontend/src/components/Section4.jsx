import React from "react";

const Section4 = ({ data }) => {
  return (
    <div className='space-y-4 mt-6'>
      <div className='space-x-14'>
        <span>Notification No</span>
        <span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
          {data?.ZitemNo}
        </span>
      </div>
      <div className='space-x-[66px]'>
        <span>Description</span>
        <span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
          {data?.Zdesc}
        </span>
      </div>
      <div className='space-x-[70px]'>
        <span>Equipment #</span>
        <span className='border border-[#b4ed47] p-[2px] w-40 pr-40 rounded-md'>
          {data?.EquipmentNo}
        </span>
      </div>
      <div className='space-x-[50px]'>
        <span>Priority</span>
        <span className='border border-[#b4ed47] p-[2px] rounded-md pr-40 w-40'>
          {data?.Priority}
        </span>
      </div>
      <div className='flex flex-col space-y-4'>
        <div>
          <span>Start Date </span>
          <span className='border border-[#b4ed47] p-[4px] w-20 rounded-md'>
            {data?.CreatedDate}
          </span>
        </div>
        <div>
          <span>End Date </span>
          <span className='border border-[#b4ed47] p-[4px] rounded-md'>
            {data?.ZendD}
          </span>
        </div>
        <div>
          <span>End Time </span>
          <span className='border border-[#b4ed47] p-[4px] rounded-md'>
            {data?.ZendT}
          </span>
        </div>
        <div>
          <span>Work Centre </span>
          <span className='border border-[#b4ed47] p-[4px] rounded-md'>
            {data?.WorkCentre}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Section4;
