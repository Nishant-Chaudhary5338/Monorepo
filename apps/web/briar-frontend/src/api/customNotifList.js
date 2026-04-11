/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const fetchCustomNotificationData = async (accessToken, reportedBy, startDate, endDate, plannerGroupFilter,
  plantSectionFilter, statusFilter, skip) => {
  try {
    const response = await axios.get(
      `${baseUrl}/api/custom_notif_list`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          reportedBy: reportedBy, 
          startDate: startDate, 
          endDate: endDate, 
          plannerGroupFilter: plannerGroupFilter,
				  plantSectionFilter: plantSectionFilter,
          statusFilter,
          skip: skip,
        }
      }
    );

    return response.data.znotifc_view_helpType;
  } catch (error) {
    throw error;
  }
};
