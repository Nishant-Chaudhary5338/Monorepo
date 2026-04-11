import React from "react";

const ErrorPopup = ({ message, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center text-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-4 rounded-lg'>
        <p className='text-xl text-red-600'>{message}</p>
        <button
          className='mt-4 px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700'
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
