/* eslint-disable no-useless-catch */
import axios from "axios";
import baseUrl from '../api/apiConfig';

export const getFilterSearchHelp = async (access_token, func_loc, plantSection, location) => {
    try {
        // Define the params object with func_loc always included
        const params = {
            func_loc: func_loc,
        };

        // Conditionally add plantSection to the params if it has a value
        if (plantSection) {
            params.plant_section = plantSection;
        }

        // Conditionally add location to the params if it has a value
        if (location) {
            params.location = location;
        }

        const response = await axios.get(`${baseUrl}/api/filter_help`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            params: params // Pass the params object to the request
        }); 
        return response.data;
    } catch (error) {
        throw error;
    }
};
