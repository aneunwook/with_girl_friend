import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api', // 서버 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// // 토큰 갱신 함수
// export const refreshAccessToken = async (refreshToken) => {
//   try {
//     const response = await axios.post(
//       'http://localhost:3000/api/auth/refresh',
//       { refreshToken }
//     );
//     const { accessToken, refreshToken: newRefreshToken } = response.data;

//     // 로컬 스토리지에 새로운 토큰 저장
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', newRefreshToken);

//     return accessToken;
//   } catch (error) {
//     console.error('Token refresh failed:', error);
//     throw error;
//   }
// };

// // 요청 인터셉터
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem('accessToken');
//     console.log('Access Token from LocalStorage:', accessToken);

//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//       console.log('Authorization Header Set:', config.headers.Authorization);
//     } else {
//       console.warn('Access Token is missing or undefined.');
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // 응답 인터셉터
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 403 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem('refreshToken');
//         if (!refreshToken) {
//           console.error('Refresh Token is missing.');
//           return Promise.reject(error);
//         }

//         const { data } = await axios.post(
//           'http://localhost:5000/api/auth/refresh',
//           { refreshToken }
//         );

//         // 새 토큰 저장
//         localStorage.setItem('accessToken', data.accessToken);
//         localStorage.setItem('refreshToken', data.refreshToken);

//         // 헤더 업데이트 후 요청 재시도
//         originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error('Failed to refresh token:', refreshError);
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
