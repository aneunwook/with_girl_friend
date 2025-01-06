import axiosInstance from "../axiosInstance";

const api_url = '/anniversaries'

export const createAnniversary = async (data) => {
    try{
        const response = await axiosInstance.post(api_url, data);
        return response.data;
    }catch(err){
        console.error("Error creating anniversary", err);
        throw err;
    }
}

export const getAnniversariesByDateRange = async (startDate, endDate) => {
    try{
        const response = await axiosInstance.get(api_url, {
            params: {startDate, endDate},
        })
        return response.data;
    }catch(err){
        console.error("Error fetching anniversaries", err);
        throw err;
    }
}