/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const fetchServiceDetails = async (access_token, NotificationNumber) => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/service_details`,
      { NotificationNumber },
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
