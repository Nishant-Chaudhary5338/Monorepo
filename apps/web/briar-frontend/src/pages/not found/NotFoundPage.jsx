import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Check if access_token exists in localStorage
  const accessToken = localStorage.getItem("access_token");

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
      <p className='text-lg mb-8'>
        The page you are looking for does not exist.
      </p>
      {accessToken ? (
        <Link to='/home' className='text-blue-500 hover:underline'>
          Go to Home
        </Link>
      ) : (
        <Link to='/' className='text-blue-500 hover:underline'>
          Go to Login
        </Link>
      )}
    </div>
  );
};

export default NotFoundPage;
