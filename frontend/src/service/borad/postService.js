import axiosInstance from "../axiosInstance";
import {refreshAccessToken} from "../axiosInstance"

const api_url = '/posts';

//API 요청에 토큰을 포함 (클라이언트)
export const getPosts = async (page, limit) => {
    try {
        // 토큰 가져오기
        const token = localStorage.getItem('authToken');
        console.log('로컬 스토리지에서 가져온 토큰:', token);

        if (!token) {
            throw new Error('No auth token found');
        }

        // 요청 보내기
        const response = await axiosInstance.get(api_url, 
            {
            headers: {
                Authorization: `Bearer ${token}`, // Authorization 헤더 설정
            },
            params: { page, limit },
        });

        console.log('Server response data: ', response.data);
        return response.data;
    }catch (err) {
        if (err.response?.status === 403) {
            console.log("403 Forbidden: Trying to refresh token...");
            try {
                // 리프레시 토큰으로 새 액세스 토큰 요청
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token found');
                }

                const { accessToken: newToken } = await refreshAccessToken(refreshToken);
                console.log('새로 갱신된 토큰: ', newToken);

                // 새 토큰 저장
                localStorage.setItem('authToken', newToken);

                // 새 토큰으로 요청 재시도
                const retryResponse = await axiosInstance.get(api_url, {
                    headers: {
                        Authorization: `Bearer ${newToken}`,
                    },
                    params: { page, limit },
                });

                console.log('재시도 서버 응답 데이터: ', retryResponse.data);
                return retryResponse.data;

            } catch (refreshError) {
                console.error("토큰 갱신 실패: ", refreshError);
                throw refreshError; // 필요하면 로그아웃 처리
            }
        }

        console.error('요청 실패:', err);
        throw err; // 다른 에러의 경우 다시 던지기
    }
};

export const createPost = async (title, content) => {
    try{
        const response = await axiosInstance.post(api_url, {title, content})
        return response.data;
    }catch(err){
        console.error("Error creating post:", err);
        throw err;
    }
}

export const getPostsById = async (id) => {
    try{
        const response = await axiosInstance.get(`${api_url}/${id}`);
        return response.data;
    }catch(err){
        console.error('Error fetching post by ID: ', err);
        throw new Error("Failed to fetch post")
    }
}

export const updatePost = async (id, title, content) => {
    try{
        const response = await axiosInstance.put(`${api_url}/${id}`, {title, content})
        return response.data;
    }catch(err){
        console.error("Error updating post: ", err);
        throw err;
    }
}

export const deletePost = async (id) => {
    try{
        const response = await axiosInstance.delete(`${api_url}/${id}`);
        return response.data;
    }catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}