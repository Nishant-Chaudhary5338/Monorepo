import axios from "axios";
import baseUrl from '../api/apiConfig';

export const stockTransfer = async (data) => {
  try {
    const access_token = localStorage.getItem("access_token")
    const response = await axios.post(`${baseUrl}/api/stock_transfer`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("API request failed");
  }
};


