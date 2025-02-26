import axiosInstance from '../axiosInstance';

const api_url = '/photos';

export const getAllPosts = async (page, limit) => {
  try {
    const response = await axiosInstance.get(`${api_url}/allPost`, {
      params: { page, limit },
    });
    return response.data; // API 응답 데이터 { posts, totalPages, currentPage }
  } catch (err) {
    console.error('요청실패', err);
    throw err;
  }
};

export const uploadPosts = async (files) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('photos', file, `temp-image-${index}.jpg`);
  });

  try {
    const response = await axiosInstance.post(`${api_url}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data && response.data.urls) {
      return response.data.urls; // 응답에 urls가 있을 경우 반환
    } else {
      throw new Error('URLs not found in the response.');
    }
  } catch (error) {
    console.error('이미지 임시 업로드 실패:', error);
    if (error.response) {
      console.error('서버 오류 응답:', error.response.data); // 서버 에러 메시지 출력
    }
    throw error;
  }
};

export const searchPost = async (query) => {
  try {
    const url = `/photos/whatSearch`; //  URL 명확하게 지정
    console.log('🔍 검색 요청 URL:', url, 'query:', query);

    const response = await axiosInstance.get(`${api_url}/whatSearch`, {
      params: { query },
    });
    console.log('🔍 검색 결과:', response.data); // 서버에서 받은 데이터 확인
    return response.data;
  } catch (err) {
    console.error('요청 실패:', err);
    throw err;
  }
};

export const createPostWithPhotos = async (data, formData) => {
  try {
    const response = await axiosInstance.post(`${api_url}/photo`, formData, {
      headers: { 'Content-Type': 'application/json' },

      params: {
        data: JSON.stringify(data), // 기존 데이터는 JSON으로 처리
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in uploading post:', error);
    throw error;
  }
};

export const getPostDetails = async (postId) => {
  try {
    const response = await axiosInstance.get(`${api_url}/${postId}`);
    return response.data;
  } catch (error) {
    console.error('게시물 상세 조회 오류', error);
    throw error;
  }
};

export const updatePostWithPhotos = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`${api_url}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('수정 실패', error);
    throw error;
  }
};

export const deletePostWithPhotos = async (postId) => {
  try {
    const response = await axiosInstance.delete(`${api_url}/${postId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 삭제 실패', error);
    throw error;
  }
};
