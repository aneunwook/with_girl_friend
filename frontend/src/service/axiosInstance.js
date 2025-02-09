import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // 서버 기본 URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 자동으로 JWT 추가 (API 요청을 보낼 때 자동으로 JWT가 포함됨!)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('🚀 요청 헤더 확인:', config.headers);
    console.log('🚀 요청 헤더 확인:', axios.defaults.headers.common);

    const token = localStorage.getItem('token'); // 🔥 요청이 발생할 때마다 최신 토큰을 가져옴
    console.log('🚀 axios 요청 시 포함된 토큰:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('🚨 axios 요청 시 토큰이 없음!');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
