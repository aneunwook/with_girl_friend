import axiosInstance from "../axiosInstance";

export const signUp = async(userData) => {
    try{
        const response = await axiosInstance.post('/signUp', userData);
        console.log("data:", response.data);
        return response.data
    }catch(err){
        console.error('회원가입 오류', err);
        throw err;
    }
}

export const signIn = async(userData) => {
    try{
        const response = await axiosInstance.post('/signIn', userData);
        console.log("data:", response.data);
        return response.data
    }catch(err){
        console.error('회원가입 오류', err);
        throw err;
    }
}