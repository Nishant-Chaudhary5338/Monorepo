import React, { useState, useEffect } from "react";

const SquareRadioButton = ({ selectedValue }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(selectedValue);
  }, [selectedValue]);

  return (
    <div className='inline-flex items-center'>
      <input
        type='checkbox'
        className='appearance-none w-4 h-4 border border-gray-400 rounded-sm checked:bg-blue-500 checked:border-transparent focus:outline-none'
        checked={checked}
        readOnly
      />
    </div>
  );
};

export default SquareRadioButton;
