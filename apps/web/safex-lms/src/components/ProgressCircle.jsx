import React, { useEffect, useState } from "react";
import CircleProgressBar from "react-circle-progress-bar";

const ProgressCircle = ({ percentage }) => {
  const [currentPercentage, setCurrentPercentage] = useState(0);

  useEffect(() => {
    // Add animation to gradually increase the percentage
    if (currentPercentage < percentage) {
      const interval = setInterval(() => {
        setCurrentPercentage((prevPercentage) => prevPercentage + 1);
      }, 10); // You can adjust the interval to control the animation speed

      return () => clearInterval(interval);
    }
  }, [percentage, currentPercentage]);

  const options = {
    size: 100,
    lineWidth: 40,
    progress: currentPercentage,
    startAngle: 0, // Start from 0 degrees
    ballStrokeWidth: 16,
    strokeWidth: 14,
  };

  return (
    <div className='font-semibold'>
      <CircleProgressBar className='h-20 w-20' {...options} />
    </div>
  );
};

export default ProgressCircle;
