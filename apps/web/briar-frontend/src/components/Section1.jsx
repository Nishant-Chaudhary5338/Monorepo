import React, { useState } from "react";
import DropDownButton from "../small-components/DropDownButton";
import SquareRadioButton from "../small-components/SquareRadioButton";
import DateInput from "./DateInput";

const Section1 = () => {
  const options = [
    { value: "P1-Emergency", label: "P1-Emergency" },
    { value: "P2-Risk", label: "P2-Risk" },
    { value: "P3-Repair/replace", label: "P3-Repair/replace" },
  ];

  return (
    <div className=''>
      <div className='space-y-2'>
        <div className='sm:space-x-16 flex'></div>
        <div className='space-x-16'>
          <span>Call Number</span>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
            00000075555
          </span>
        </div>
        <div className='space-x-16'>
          <span>Service Type</span>
          <span className='border border-[#b4ed47] p-[2px] rounded-md pr-20'>
            M10
          </span>
        </div>
      </div>
      <div className='space-y-2 mt-2'>
        <div className='space-x-4 sm:flex items-center sm:space-x-[98px]'>
          <span className=''>Priorty</span>
          <DropDownButton options={options} />
        </div>
      </div>
      <div className='space-y-2 mt-2 pr-20'>
        <DateInput title='Start Date' />
        <DateInput title='End Date' />
      </div>
    </div>
  );
};

export default Section1;
