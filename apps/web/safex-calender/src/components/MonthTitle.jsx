import React from "react";

const MonthTitle = ({ title }) => {
  return (
    <div>
      <h2 className='text-[35px] sm:text-[65px] lg:text-[42px] xl:text-[52px] 2xl:text-[64px] font-["Times_New_Roman"] text-white'>
        {title}
      </h2>
    </div>
  );
};

export default MonthTitle;
