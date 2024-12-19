import axios from 'axios';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // 서버 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 함수
export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axiosInstance.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // 로컬 스토리지에 새로운 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        return accessToken;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('authToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('No refresh token available');
                return Promise.reject(error);
            }

            try {
                const { data } = await axiosInstance.post('/auth/refresh', { refreshToken });
                localStorage.setItem('authToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;