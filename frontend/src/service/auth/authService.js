import axiosInstance from '../axiosInstance';

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/signUp', userData);
    console.log('data:', response.data);
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
    const response = await axiosInstance.post('/auth/signIn', userData); // 여기가 문제일 수 있음
    console.log('응답 전체:', response);
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
