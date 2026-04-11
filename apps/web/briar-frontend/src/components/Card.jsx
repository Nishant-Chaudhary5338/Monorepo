import React from "react";

const Card = ({ title, onClick, icon }) => {
  return (
    <div className='m-1 p-1'>
      <div
        onClick={onClick}
        className='h-[200px] w-60 flex space-y-10 hover:scale-105 flex-col items-start py-6 px-2 border border-[#b4ed47] bg-white  rounded-md shadow-lg'
      >
        <h3 className='text-center  text-2xl'>{title}</h3>
        <div>{icon}</div>
      </div>
    </div>
  );
};

export default Card;
