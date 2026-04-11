/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const accessTiles = async(accessToken, username) => {
    try{
      const response = await axios.get(
      `${baseUrl}/api/access`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "username": username,
        },
      },
    );
    return response.data
    }catch (error){
     throw(error)
    }
}