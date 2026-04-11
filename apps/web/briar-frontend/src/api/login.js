/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const loginUser = async (username, password) => {
  const url = `${baseUrl}/api/token`; // Replace with your API endpoint URL
  const base64Credentials = window.btoa(`${username}:${password}`);

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });

    if (response.status === 200) {
      return response.data.accessToken;
    }
  } catch (error) {
    throw error;
  }
};
