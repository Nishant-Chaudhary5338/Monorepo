/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const fetchNotificationData = async (accessToken, reportedBy) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/notification_list`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Reported-By": reportedBy,
        },
      },
    );

    return response.data.znotifc_view_helpType;
  } catch (error) {
    throw error;
  }
};
