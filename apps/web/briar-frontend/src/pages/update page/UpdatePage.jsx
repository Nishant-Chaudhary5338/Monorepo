import React, { useEffect, useState } from "react";
import CTTable from "../../components/CTTable";
import axios from "axios";
import { useParams } from "react-router-dom";
import LogoutButton from "../../small-components/LogoutButton";
import UpdateRender from "./UpdateRender";
import LoadingSpinner from "../../small-components/LoadingSpinner";
import { fetchServiceDetails } from "../../api/serviceDetails";
import HomeButton from "../../small-components/HomeButton";
import useAccess, { Notif_Rep_Access } from "../../hooks/useAccess";
import NotFoundPage from "../not found/NotFoundPage";
const UpdatePage = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { NotificationNumber } = useParams();
  console.log(NotificationNumber);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const notifNumber = NotificationNumber;

      const data = await fetchServiceDetails(access_token, notifNumber);
      setResponseData(data);
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=' bg-gray-50 h-screen'>
      <div className='h-12 bg-[#71a311] items-center flex justify-between px-4'>
        <HomeButton />
        <h1 className='text-white text-2xl font-semibold '>
          Service Update of Notification - {NotificationNumber}
        </h1>
        <LogoutButton />
      </div>
      {loading ? (
        <LoadingSpinner text='Loading...' />
      ) : (
        <div className=''>
          <div className='p-10 m-20 rounded-3xl px-20 items-center flex justify-between shadow-2xl shadow-[#71a311]'>
            <UpdateRender
              data={
                responseData?.["n0:ZbapiAlmNotifGetDetailResponse"]?.ZgetDet
              }
            />
            <CTTable
              data={
                responseData?.["n0:ZbapiAlmNotifGetDetailResponse"]?.ZgetDet
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePage;
