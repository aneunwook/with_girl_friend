import axios from "axios";

const api_url = 'http://localhost:5000/api/posts';

export const getPosts = async (page, limit) => {
    try{
        const response = await axios.get(api_url, {
            params:{page, limit}
        })
        console.log("Response data : ", response.data);
        return response.data;
    }catch(err){
        console.error("Error fetching posts: " ,err);
        return{posts:[], totalPages: 1}
    }
}

export const createPost = async (title, content) => {
    try{
        const response = await axios.post(api_url, {title, content})
        return response.data;
    }catch(err){
        console.error("Error creating post:", err);
        throw err;
    }
}

export const getPostsById = async (id) => {
    try{
        const response = await axios.get(`${api_url}/${id}`);
        return response.data;
    }catch(err){
        console.error('Error fetching post by ID: ', err);
        throw new Error("Failed to fetch post")
    }
}

export const updatePost = async (id, title, content) => {
    try{
        const response = await axios.put(`${api_url}/${id}`, {title, content})
        return response.data;
    }catch(err){
        console.error("Error updating post: ", err);
        throw err;
    }
}

export const deletePost = async (id) => {
    try{
        const response = await axios.delete(`${api_url}/${id}`);
        return response.data;
    }catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}