/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const getBom = async(accesstoken, equnr) => {
    try{
        const data = {
            Equnr: equnr
        }
       const response = await axios.post(`${baseUrl}/api/bom`,
       data,
        {
        headers: {
            Authorization: `Bearer ${accesstoken}`
        }

       });
       return response.data;

    }catch(error){
      throw(error);
    }
}