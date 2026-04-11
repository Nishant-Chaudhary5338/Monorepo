/* eslint-disable no-useless-catch */
import axios from "axios";
import baseUrl from '../api/apiConfig';

export const getQualityControl = async (value) => {
  try {
    

    const access_token = localStorage.getItem("access_token");

    const response = await axios.get(
      `${baseUrl}/api/qc`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          value: value,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};



