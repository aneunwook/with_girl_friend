import { response } from "express";
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

export const createPostWithPhotos = async (data, files) => {
    //새 게시물을 생성하면서 파일 업로드를 처리해야 하므로 FormData를 사용
    const formData = new FormData();

    //게시물 데이터 추가
    formData.append('user_id', 1); // 실제 사용자 ID를 추가
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('tags', data.tags);

    //파일 추가
    if(files && files.length > 0){
        files.forEach((file) => {
            formData.append('photos', file);
        });
    }

    const response = await axiosInstance.post(`${api_url}/upload`, formData, {
        headers: {'Content-Type' : 'multipart/form-data'},
    })
    return response.data;
}

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