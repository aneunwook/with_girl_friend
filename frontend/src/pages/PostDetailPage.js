import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostsById, deleteData } from "../service/postService";
import '../assets/styles/PostDetailPage.css';

const PostDetailPage = () => {
    const {id} = useParams();
    const [post, setPost] = useState(null);
    const navigator = useNavigate();

    useEffect(() => {
        const fetchPost = async() => {
            try{
                const data = await getPostsById(id);
                setPost(data);
            }catch(error){
                console.error('Error fetching post:', error);
            }
        }
        fetchPost();
    }, [id])

    if (!post) {
        return <div>Loading...</div>;
    }

    const deleteHandle = async() => {
        try{
            await deleteData(id);
            alert('게시물이 삭제되었습니다');
            navigator('/')
        }catch(error){
            console.error('게시물 삭제 중 에러발생', error);
            alert('게시물 삭제 실패');
        }
    }

    const handleEdit = () => {
        navigator(`/edit-post/${id}`);
    }

    return(
        <div className="post-detail-page">
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <button onClick={handleEdit}>수정</button>
            <button onClick={deleteHandle}>삭제</button>
        </div>
    )
}

export default PostDetailPage;