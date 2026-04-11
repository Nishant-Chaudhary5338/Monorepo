import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className='flex flex-col items-center justify-center mx-10 mt-40 space-x-10 text-6xl font-semibold'>
      <div>ERROR 404 </div>
      <div>Page not Found</div>
      <div>Go back to</div>
      <div>
        <span className='text-green-500'>
          <Link to='/home'>Home</Link>
        </span>
      </div>
    </div>
  );
};

export default NotFoundPage;
