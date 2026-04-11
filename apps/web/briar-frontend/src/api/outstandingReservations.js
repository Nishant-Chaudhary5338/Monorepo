/* eslint-disable no-useless-catch */
import axios from "axios";
import baseUrl from '../api/apiConfig';

export const getOutstandingReservations = async () => {
  try {
    

    const access_token = localStorage.getItem("access_token");
    console.log("Access Token *****************",access_token);
    const response = await axios.get(
      `${baseUrl}/api/outstandingReservations`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};