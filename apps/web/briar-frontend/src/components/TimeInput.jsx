/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { format, utcToZonedTime } from "date-fns-tz";

const TimeInput = ({ onTimeChange, title }) => {
  const [selectedTime, setSelectedTime] = useState("");

  const handleInputClick = () => {
    const currentDateTime = new Date();
    const ukTimeZone = "Europe/London"; // Use the timezone for the UK

    if (selectedTime) {
      // Reset the time if already set
      setSelectedTime("");
      onTimeChange("");
    } else {
      // Display the current time in UK format
      const ukTime = format(
        utcToZonedTime(currentDateTime, ukTimeZone),
        "HH:mm:ss",
      );

      setSelectedTime(ukTime);
      onTimeChange(ukTime);
    }
  };

  return (
    <div className='flex space-x-2'>
      <label className='text-sm text-gray-700 font-semibold w-28'>
        {title}
      </label>
      <input
        className='border border-[#b4ed47] p-[2px] rounded-md'
        placeholder='hh:mm:ss'
        type='text'
        value={selectedTime}
        onClick={handleInputClick}
        readOnly
      />
    </div>
  );
};

export default React.memo(TimeInput);
