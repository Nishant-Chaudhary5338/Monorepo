import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const CalenderShot = ({ dates, xlDates }) => {
  return (
    <div className='w-full backdrop-filter bg-opacity-30'>
      {/* Mobile */}
      <LazyLoadImage className='w-full sm:hidden' effect='blur' src={dates} alt='' />
      <img
        src={xlDates}
        alt=''
        loading='lazy'
        className='hidden sm:block w-full'
      />
    </div>
  );
};

export default CalenderShot;
