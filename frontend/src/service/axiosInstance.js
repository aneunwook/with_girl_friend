import axios from 'axios';

const redirectToLogin = () => {
    console.log('[redirectToLogin] 로그아웃 처리 및 로그인 페이지로 이동');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // window.location.href = '/login'; // Uncomment to enable redirection
};

// Access Token 만료 여부 체크 함수
const isTokenExpired = (token) => {
    if (!token) return true; // 토큰이 없으면 만료로 간주
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("[isTokenExpired] Token payload:" , payload);
        return payload.exp * 1000 < Date.now();
    } catch (error) {
        console.error('[isTokenExpired] 토큰 파싱 실패:', error);
        return true; // 토큰 파싱 실패 시 만료로 간주
    }
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
});

// 토큰 갱신 함수
export const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('[refreshAccessToken] 로컬 스토리지에서 가져온 refreshToken:', refreshToken);
        
        if (!refreshToken) {
            console.error('[refreshAccessToken] Refresh token not found.');
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            redirectToLogin();
            throw new Error('No refresh token');
        }

        const response = await axiosInstance.post('http://localhost:5000/api/auth/refresh', { refreshToken });
        console.log('[refreshAccessToken] 서버 응답:', response.data);

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        if (accessToken && newRefreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            axiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
            console.log('[refreshAccessToken] Access Token 갱신 완료:', accessToken);
            return accessToken;
        } else {
            console.error('[refreshAccessToken] 서버 응답에 토큰 누락:', response.data);
            throw new Error('Token refresh failed');
        }
    } catch (error) {
        console.error('[refreshAccessToken] 토큰 갱신 실패:', error);
        redirectToLogin();
        throw error;
    }
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    async (config) => {
        const excludedPaths = ['/auth/signUp', '/auth/signIn']; // 예외 처리할 경로
        console.log('[Request Interceptor]', config);
        if (excludedPaths.some((path) => config.url.includes(path))) {
            console.log('[Request Interceptor] 회원가입/로그인 요청 예외 처리:', config.url);
            return config;
        }

        let accessToken = localStorage.getItem('accessToken');
        if (isTokenExpired(accessToken)) {
            console.log('[Request Interceptor] Access token expired. Refreshing...');
            accessToken = await refreshAccessToken(); // 새로운 토큰 갱신
        }

        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('[Response Interceptor] 성공 응답:', response);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.error('[Response Interceptor] 에러 응답:', error.response);

        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('[Response Interceptor] 토큰 갱신 시도...');
                const newAccessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                console.log('[Response Interceptor] 요청 재전송');
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('[Response Interceptor] 토큰 갱신 실패:', refreshError);
                redirectToLogin();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;