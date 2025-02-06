import axiosInstance from '../axiosInstance';

// 1. 이메일 인증 요청 (인증 코드 전송)
export const requestEmailVerification = async (email) => {
  try{
    const response = await axiosInstance.post('/auth/sendEmailVerification', {email});
    return response.data;
  }catch(err){
    console.error("이메일 인증 요청 실패", err);
    throw err;
  }
}

// 2. 이메일 인증 코드 검증
export const verifyEmailCode = async (email, code) => {
  try{
    const response = await axiosInstance.post('/auth/verifyEmailCode', {email, code});
    return response.data;
  }catch (err) {
    console.error("인증 코드 확인 실패:", err);
    throw err;
  }
}

export const checkEmail = async (email) => {
  try{
    const response = await axiosInstance.post('/auth/check-email', {email});
    return response;
  }catch(err){
    console.error("이메일이 중복 되었습니다", err);
    throw err;
  }
}

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/signUp', userData);
    console.log('data:', response.data);

     //JWT 토큰 저장 (로컬 스토리지에 저장)
     localStorage.setItem('token', response.data.token);

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error('회원가입 오류:', err.response.data); // 서버 응답 오류 내용
    } else {
      console.error('회원가입 요청 실패:', err.message); // 네트워크 오류 등
    }
    throw err;
  }
};

export const signIn = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/signIn', userData);
    console.log('응답 전체:', response);

    // 로그인 성공 시 JWT 저장
    //localStorage.setItem('token', response.data.token);

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error('로그인 오류:', err.response.data);
    } else {
      console.error('로그인 요청 실패:', err.message);
    }
    throw err;
  }
};

export const getUserProfile = async (token) => {
  try {
      const response = await axiosInstance.get('/auth/profile', {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error("❌ 사용자 정보 요청 실패:", error);
      throw error;
  }
};
