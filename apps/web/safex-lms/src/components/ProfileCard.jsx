import React from "react";

const ProfileCard = () => {
  return (
    <div className='h-96 w-60 rounded-xl bg-gray-100 shadow-2xl'>
      <div>
        <img
          src='https://img.icons8.com/ios-filled/200/FFFFFF/user-male-circle.png'
          alt='Avatar'
          className='w-40 h-40 mx-auto' // You can adjust the size and margin as needed
        />
      </div>
      <div>
        <h4 className='text-cnter'>My Profile</h4>
        <p>Web Developer</p>
      </div>
    </div>
  );
};

export default ProfileCard;
