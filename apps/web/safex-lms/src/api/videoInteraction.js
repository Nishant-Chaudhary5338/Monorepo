import axios from 'axios';
import baseUrl from '../api/apiConfig';

export const videoInteraction = async( email, videoTitle, totalTime, playbackTime) => {
    try{
      const response = await axios.post(
      `${baseUrl}/api/v1/video_info`,
      { email, videoTitle, totalTime, playbackTime }
    );
    return response;
    }catch (error){
     console.log(error);   
     throw(error)
    }
}


export const getVideoInteractions = async () => {
    try{
        const response = await axios.get(
            `${baseUrl}/api/vi/video_info`,
        );
        return response;
    }catch(error){
        console.log(error)
        throw(error);
    }
}