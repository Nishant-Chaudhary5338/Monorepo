/* eslint-disable no-useless-catch */
import axios from "axios";
import baseUrl from './apiConfig';

export const getUnrestrictStockReport = async () => {
  try {
    

    const access_token = localStorage.getItem("access_token");

    const response = await axios.get(
      `${baseUrl}/api/unrestrict_stock_report`,
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



