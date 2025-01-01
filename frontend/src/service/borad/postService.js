import axiosInstance from '../axiosInstance';

const api_url = '/posts';

//API 요청에 토큰을 포함 (클라이언트)
export const getPosts = async (page, limit) => {
  try {
    console.log('게시물 데이터 요청: 페이지:', page, '항목 수:', limit);

    // 게시물 데이터 요청
    const response = await axiosInstance.get(api_url, {
      params: { page, limit }, // 페이지와 항목 수를 쿼리로 전달
    });

    console.log('서버 응답 데이터:', response.data);
    return response.data;
  } catch (err) {
    console.error('게시물 요청 실패:', err);
    throw err;
  }
};

export const createPost = async (title, content) => {
  try {
    const response = await axiosInstance.post(api_url, { title, content });
    return response.data;
  } catch (err) {
    console.error('Error creating post:', err);
    throw err;
  }
};

export const getPostsById = async (id) => {
  try {
    const response = await axiosInstance.get(`${api_url}/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching post by ID: ', err);
    throw new Error('Failed to fetch post');
  }
};

export const updatePost = async (id, title, content) => {
  try {
    const response = await axiosInstance.put(`${api_url}/${id}`, {
      title,
      content,
    });
    return response.data;
  } catch (err) {
    console.error('Error updating post: ', err);
    throw err;
  }
};

export const deletePost = async (id) => {
  try {
    const response = await axiosInstance.delete(`${api_url}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
