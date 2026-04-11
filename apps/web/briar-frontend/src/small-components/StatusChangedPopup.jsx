import React from "react";
import { TiTick } from "react-icons/ti";

const StatusChangedPopup = ({ onClose, statusResponse }) => {
  console.log("accessed from popup", statusResponse);

  console.log("accessed from popup", statusResponse.typ);
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white w-80 p-6 rounded-md'>
        <div className='flex justify-center mb-6'>
          <p className='bg-[#71a311] rounded-full p-1 -mt-12'>
            <TiTick size={50} className='' color='white' />
          </p>
        </div>
        <h2 className='text-2xl text-center font-bold mb-4'>
          {statusResponse.typ}
        </h2>
        <p className='text-lg mb-6'> {statusResponse.status}</p>
        <button
          className='block w-full py-2 px-4 bg-[#71a311] text-white rounded-md hover:bg-blue-600'
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default StatusChangedPopup;
