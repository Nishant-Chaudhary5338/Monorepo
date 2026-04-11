/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const getBomHelp = async (accessToken) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/bom_help`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.zeq_bom_helpType;
  } catch (error) {
    throw error;
  }
};
