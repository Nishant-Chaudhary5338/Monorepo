/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const saveTextUpdate = async (zNumber, shortInputValue, longInputValue, access_token, priority, checkboxChecked, plannerGroup) => {

  
  try {

   
    const requestBody = {
      Header: {
        Znumber: zNumber,
        GenDesc1: shortInputValue,
        GenDesc: longInputValue,
        Breakdown: checkboxChecked,
        PlannerGroup: plannerGroup,
        Priority: priority,
      },
    };

    console.log("Request Body", requestBody)

    const response = await axios.post(
      `${baseUrl}/api/text_update`, // Change this URL to your API endpoint
      requestBody,
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
