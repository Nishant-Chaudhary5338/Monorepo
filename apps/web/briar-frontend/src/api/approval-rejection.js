/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const ApproveRejectEntry = async (Znumber, statusInt, access_token, date, time, email) => {
  try {
    const payload = {
      IMP: {
        ZNUMBER: Znumber,
        STATUS_INT: statusInt,
        STATUS_EXT: "Stri",
        ZMAIL : email
      },
    };

    if (statusInt === "COM") {
      payload.IMP.ZDATE = date;
      payload.IMP.ZTIME = time;
    }else{
      const now = new Date();
      payload.IMP.ZDATE = now.toISOString().split('T')[0];
      payload.IMP.ZTIME = now.toTimeString().split(' ')[0];
    }

    console.log("PAYLOAD", payload)

    const response = await axios.post(
      `${baseUrl}/api/update_entry`,
      payload,
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
