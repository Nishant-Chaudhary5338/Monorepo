import React from "react";
import { useAuth } from "../../context/AuthContext"; // Import the useAuth hook
import { Navigate } from "react-router";

const HomePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to='/login' />;
  }

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {user && (
        <div>
          <p>User Information:</p>
          <ul>
            {Object.keys(user).map((key) => (
              <li className='space-y-2 bg-gray-200 py-2 my-2 ' key={key}>
                {key}: {JSON.stringify(user[key])}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePage;
