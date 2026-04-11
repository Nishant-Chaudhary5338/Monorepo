import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";

const HomeButton = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/home");
  };

  return (
    <div
      onClick={handleNavigateHome}
      className='flex font-semibold items-center space-x-1'
    >
      <button className='text-white text-xl font-semibold rounded-md'></button>
      <AiOutlineHome color='white' size={20} />
    </div>
  );
};

export default HomeButton;
