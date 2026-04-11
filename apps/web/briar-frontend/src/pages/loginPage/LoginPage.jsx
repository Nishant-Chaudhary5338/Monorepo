import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/login";
import { accessTiles } from "../../api/access";
import LoadingSpinner from "../../small-components/LoadingSpinner";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Perform validation
    if (username === "" || password === "") {
      setError("Please enter a username and password.");
      return;
    }

    setLoading(true);
    try {
      const accessToken = await loginUser(username, password);

      if (accessToken) {
        console.log("Access Token:", accessToken);
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("username", username);

        // Set a timeout to remove the access_token from localStorage after 2 minutes
        setTimeout(() => {
          localStorage.removeItem("access_token");
          console.log("Access_token expired. Removed from local storage.");
          navigation("/");
        }, 10 * 60 * 1000); // 10 minutes in milliseconds

        try {
          const accessToken = localStorage.getItem("access_token");
          const username = localStorage.getItem("username");

          const AccessResponse = await accessTiles(accessToken, username);
          console.log(AccessResponse);
          localStorage.setItem("access_data", JSON.stringify(AccessResponse));

          setTimeout(() => {
            localStorage.removeItem("access_data");
            console.log("Access_data expired. Removed from local storage.");
            navigation("/");
          }, 10 * 60 * 1000); // 10 minutes in milliseconds

          navigation("home");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
      alert("Please enter correct Username and Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50'>
          <LoadingSpinner text='Logging in...' />
        </div>
      )}
      <div className='container mx-auto max-w-screen-2xl flex flex-col justify-center items-center md:mt-0'>
        {/* Left side - Image */}
        <div className='w-auto mb-10 md:mb-0'>
          <img
            src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyj4tPBkrDqJFWKXZovNHieI5xiuov4-ZXHg&usqp=CAU'
            alt='Login Image'
            className='object-contain mx-auto xl:w-96 2xl:w-[600px]'
          />
        </div>

        {/* Right side - Login Form */}
        <div className='w-full md:w-1/2  h-96 2xl:h-[600px] 2xl:py-20 flex items-center shadow-2xl bg-gray-50 px-4 sm:mt-20 md:mt-0 rounded-lg justify-center'>
          <form
            onSubmit={(e) => handleLogin(e)}
            className='w-full max-w-md space-y-10'
          >
            <h2 className='text-3xl 2xl:text-5xl font-bold mb-4'>Login</h2>

            {error && (
              <div className='bg-red-200 text-red-800 p-2 rounded mb-4'>
                {error}
              </div>
            )}

            <div className='mb-4'>
              <label
                htmlFor='username'
                className='block mb-1 2xl:text-2xl text-xl'
              >
                Username
              </label>
              <input
                type='text'
                id='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='w-full px-4 py-2 custom-border rounded-lg'
              />
            </div>

            <div className='mb-4'>
              <label
                htmlFor='password'
                className='block mb-1 2xl:text-2xl text-xl'
              >
                Password
              </label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-2 custom-border rounded-lg'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600'
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
