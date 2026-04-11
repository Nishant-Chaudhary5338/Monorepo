/* eslint-disable no-useless-catch */
import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const loginUser = async( name, email) => {
    try{
      const response = await axios.post(
      `${baseUrl}/api/v1/login`,
      { name, email }
    );
    return response
    }catch (error){
     console.log(error);   
     throw(error)
    }
}