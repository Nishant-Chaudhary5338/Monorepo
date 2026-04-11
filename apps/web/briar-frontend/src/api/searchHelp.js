/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const fetchHelpData = async (accessToken) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/help_equipment`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.znotifc_epqui_helpType;
  } catch (error) {
    throw error;
  }
};
