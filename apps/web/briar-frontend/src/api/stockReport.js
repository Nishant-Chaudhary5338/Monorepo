/* eslint-disable no-useless-catch */
import axios from "axios";
import baseUrl from '../api/apiConfig';

export const getStockReport = async () => {
  try {
    

    const access_token = localStorage.getItem("access_token");

    const response = await axios.get(
      `${baseUrl}/api/stock_report`,
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



