import React, { useEffect, useState } from "react";
import CTTable from "../../components/CTTable";
import axios from "axios";
import { useParams } from "react-router-dom";
import LogoutButton from "../../small-components/LogoutButton";

import LoadingSpinner from "../../small-components/LoadingSpinner";
import ApproveRender from "./ApproveRender";
import { fetchServiceDetails } from "../../api/serviceDetails";
import HomeButton from "../../small-components/HomeButton";
import useAccess, { Notif_Super_Access } from "../../hooks/useAccess";
import NotFoundPage from "../not found/NotFoundPage";
const ApprovePage = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { NotificationNumber,statusText } = useParams();

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
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className=' bg-gray-50 h-screen'>
      <div className='h-12 bg-[#71a311] items-center flex justify-between px-4'>
        <HomeButton />
        <h1 className='text-white text-2xl font-semibold '>
          Approve / Reject Notification - {NotificationNumber} :: {statusText}
        </h1>
        <LogoutButton />
      </div>
      {loading ? (
        <LoadingSpinner text='Loading...' />
      ) : (
        <div className=''>
          <div className='p-10 m-20 rounded-3xl px-20 items-center flex justify-between shadow-2xl shadow-[#71a311]'>
            <ApproveRender
              data={
                responseData?.["n0:ZbapiAlmNotifGetDetailResponse"]?.ZgetDet
              } statusText={statusText}
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

export default ApprovePage;
