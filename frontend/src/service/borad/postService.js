import axiosInstance from '../axiosInstance';

const api_url = '/posts';

//API 요청에 토큰을 포함 (클라이언트)
// API 요청에 토큰을 포함하는 부분 주석 처리
export const getPosts = async (page, limit) => {
  try {
    // const token = localStorage.getItem('authToken'); // 주석 처리
    // console.log('로컬 스토리지에서 가져온 토큰:', token);

    // if (!token) {
    //   throw new Error('No auth token found');
    // }

    // 요청 보내기
    const response = await axiosInstance.get(api_url, {
      // headers: { Authorization: `Bearer ${token}` }, // 주석 처리
      params: { page, limit },
    });

    console.log('Server response data: ', response.data);
    return response.data;
  } catch (err) {
    console.error('요청 실패:', err);
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
