import axiosInstance from "../axiosInstance";

export const signUp = async(userData) => {
    try{
        const response = await axiosInstance.post('/signUp', userData);
        console.log("data:", response.data);
        return response.data;
    }catch(err){
        console.error('회원가입 오류', err);
        throw err;
    }
}

export const signIn = async(userData) => {
    try{
        const response = await axiosInstance.post('/signIn', userData);
        console.log("data:", response.data);
        const {token} = response.data;

        localStorage.setItem('token', token);
        alert('로그인 성공');
    }catch(err){
        console.error('로그인 오류', err);
        throw err;
    }
}