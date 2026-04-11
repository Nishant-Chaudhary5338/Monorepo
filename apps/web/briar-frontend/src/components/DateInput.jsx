import React, { useState } from "react";
import { format } from "date-fns-tz";

const DateInput = ({ onDateChange, title }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleInputClick = () => {
    const currentDateTime = new Date();
    const ukTimeZone = "Europe/London"; // Use the timezone for the UK

    if (selectedDate) {
      // Reset the date if already set
      setSelectedDate("");
      onDateChange("");
    } else {
      // Display the current date in UK format
      const ukDate = format(currentDateTime, "yyyy-MM-dd", {
        timeZone: ukTimeZone,
      });

      setSelectedDate(ukDate);
      onDateChange(ukDate);
    }
  };

  return (
    <div className='flex space-x-2'>
      <label className='text-sm text-gray-700 font-semibold w-28'>
        {title}
      </label>
      <input
        className='border border-[#b4ed47] p-[2px] rounded-md'
        placeholder='yyyy-MM-dd'
        type='text'
        value={selectedDate}
        onClick={handleInputClick}
        readOnly
      />
    </div>
  );
};

export default React.memo(DateInput);
