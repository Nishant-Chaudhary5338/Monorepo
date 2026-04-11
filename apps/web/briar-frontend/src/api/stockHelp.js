/* eslint-disable no-useless-catch */
import axios from "axios";
import baseUrl from '../api/apiConfig';

export const getStockHelp = async(access_token) => {
    try{
       const response = await axios.get(`${baseUrl}/api/stock_help`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
       }); 
       return response.data;
    }catch (error) {
        throw(error)
    }
};