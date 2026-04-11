import React from "react";
import { useNavigate } from "react-router-dom";

const TokenExpiredPopup = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full text-center z-50 flex justify-center items-center bg-gray-800 bg-opacity-75'>
      <div className='bg-white p-6 rounded-md'>
        <h3 className='text-lg font-semibold mb-4'>Token Expired</h3>
        <p>Please login again to continue.</p>
        <button
          className='mt-4 px-4 mx-auto py-2 bg-blue-500 text-white text-center rounded-md hover:bg-blue-600'
          onClick={handleRedirect}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default TokenExpiredPopup;
