// Auth 서비스
import axiosInstance from "../axiosInstance";

export const signUp = async (userData) => {
    try {
        console.log('[signUp] 요청 데이터:', userData);

        const response = await axiosInstance.post('/auth/signUp', userData);
        console.log('[signUp] 서버 응답 데이터:', response.data);

        const { accessToken, refreshToken } = response.data;

        if (accessToken && refreshToken) {
            console.log('[signUp] Access Token 저장:', accessToken);
            console.log('[signUp] Refresh Token 저장:', refreshToken);

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            console.warn('[signUp] 토큰이 응답에 포함되지 않음. 별도 로그인 필요.');
            alert('회원가입이 완료되었습니다. 로그인하세요.');
            return response.data; // 토큰 없는 상태로 진행
        }

        console.log('[signUp] 회원가입 성공');
        return response.data;
    } catch (err) {
        console.error('[signUp] 요청 실패:', err.response ? err.response.data : err.message);
        throw err;
    }
};


export const signIn = async (userData) => {
    try {
        console.log('[signIn] 요청 데이터:', userData);

        const response = await axiosInstance.post('/auth/signIn', userData);
        console.log('[signIn] 서버 응답:', response);

        const { accessToken, refreshToken } = response.data;

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            console.log('[signIn] Access Token:', accessToken);
            console.log('[signIn] Refresh Token:', refreshToken);
        } else {
            console.error('[signIn] 서버 응답에 토큰 누락:', response.data);
            throw new Error('Token(s) missing!');
        }

        alert('로그인 성공');
        return { accessToken, refreshToken };
    } catch (err) {
        console.error('[signIn] 로그인 요청 실패:', err.response ? err.response.data : err.message);
        throw err;
    }
};