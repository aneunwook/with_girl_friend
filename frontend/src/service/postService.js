import axios from 'axios';

const api_url = 'http://localhost:5000/api/posts';

export const getPosts = async () => {
    try{
        const response = await axios.get(api_url);
        return response.data;
    }catch(error){
        console.error("Error fetching posts: ", error);
        return [];
    }
}

export const getPostsById = async (id) => {
    try{
        const response = await axios.get(`${api_url}/${id}`);
        return response.data;
    }catch (error) {
        console.error('Error fetching post by ID:', error);
    }
}

export const createPost = async (title, content) => {
    try{
        const response = await axios.post(api_url, {title, content});
        return response.data;
    }catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
}

export const updatePost = async (id, title, content) => {
    try{
        const response = await axios.put(`${api_url}/${id}`, {title,content});
        console.log(response);
        
        return response.data;
    }catch(error){
        console.error("Error updating post:", error);
        throw error;
    }
}

export const deleteData = async (id) => {
    try{
        const response = await axios.delete(`${api_url}/${id}`)
        return response.data;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}