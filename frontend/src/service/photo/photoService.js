import axiosInstance from "../axiosInstance";

const api_url = '/photos'

export const getAllPosts = async (page, limit) => {
    try{
        const response = await axiosInstance.get(`${api_url}/allPost`, {
            params: {page, limit},
        });
        return response.data; // API 응답 데이터 { posts, totalPages, currentPage }
    }catch(err){
        console.error('요청실패', err);
        throw err;
    }
}

export const createPostWithPhotos = async (data) => {
    // 새 게시물을 생성하면서 파일 업로드를 처리해야 하므로 FormData를 사용
    const formData = new FormData();
  
    // 게시물 데이터 추가
    formData.append('user_id', 1); // 실제 사용자 ID를 추가
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('tags', data.tags);
  
    console.log('FormData content:', data.description); // 값 확인

    // Base64를 Blob으로 변환하고, FormData에 이미지 파일로 추가
    data.photoUrls.forEach((url, index) => {
      const imageBlob = dataURItoBlob(url); // Base64 URL을 Blob으로 변환
      formData.append('photos', imageBlob, `image-${index}.jpg`); // Blob을 FormData에 파일로 추가
    });
  
    try {
      const response = await axiosInstance.post(`${api_url}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error("Error in uploading post:", error);
      throw error;
    }
  };
  
  // Base64 URL을 Blob으로 변환하는 함수
  const dataURItoBlob = (dataURI) => {
    try {
      const [header, base64] = dataURI.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
  
      if (!base64) throw new Error('Base64 content is missing');
  
      const binaryString = atob(base64);
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const uintArray = new Uint8Array(arrayBuffer);
  
      for (let i = 0; i < binaryString.length; i++) {
        uintArray[i] = binaryString.charCodeAt(i);
      }
  
      return new Blob([arrayBuffer], { type: mimeType || 'text/plain' });
    } catch (error) {
      console.error('Failed to convert dataURI to Blob:', error);
      return null;
    }
  };
    


export const getPostDetails = async(postId) => {
    try{
        const response = await axiosInstance.get(`${api_url}/${postId}`)
        return response.data;
    }catch(error){
        console.error('게시물 상세 조회 오류', error);
        throw error;
    }
}

export const updatePostWithPhotos = async (id, formData) => {
    try{
        const response = await axiosInstance.put(`${api_url}/${id}`, formData, {
            headers: {'Content-Type' : 'multipart/form-data'},
        })
        return response.data;
    }catch(error){
        console.error('수정 실패',error);
        throw error;
    }
}

export const deletePostWithPhotos = async (postId) => {
    try{
        const response = await axiosInstance.delete(`${api_url}/${postId}`)
        return response.data;
    }catch(error){
        console.error('게시글 삭제 실패', error);
        throw error;
    }
}