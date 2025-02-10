import axiosInstance from '../axiosInstance';

export const searchUserByEmail = async (email) => {
    try{
        console.log("🔎 검색할 이메일:", email); // 🔥 콘솔로 확인

      const response = await axiosInstance.post('/auth/search', {email});
      console.log("✅ 검색 결과:", response.data);

      
      return response.data;
    }catch(error){
      console.error("❌ 사용자 검색 오류:", error.response?.data || error.message);
      throw error;
    }
  }
  
  export const registerCouple = async (user2_email) => {
    try {
      const response = await axiosInstance.post("/couples/register", { user2_email });
      return response.data;
    } catch (error) {
      console.error("❌ 커플 등록 오류:", error.response?.data || error.message);
      throw error;
    }
  }


