import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getPostDetails } from '../../service/photo/photoService.js'
import "../../assets/styles/PostDetailPage.css"

const PostDetailPage = () => {
    const {id : postId} = useParams(); // URL의 'id' 파라미터 추출
    const [post,setPost] = useState(null);
    const [error, setError] = useState(null)
    const navigator = useNavigate();

    useEffect(() => {
        const fetchPost = async() => {
            try{
                const data = await getPostDetails(postId);
                setPost(data);
            }catch(error){
                setError('Error fetching post: ', error);
            }
        }
        fetchPost();
    }, [postId])

    if(!post){
        return <div>Loading...</div>
    }

    if(error){
        return <div>{error}</div>
    }

    // const deleteHandle = async() => {
    //     try{
    //         await deletePost(id);
    //         alert('게시글이 삭제 되었습니다');
    //         navigator('/')
    //     }catch(error){
    //         console.error('게시물 삭제 중 에러발생', error);
    //         alert('게시글 삭제 실패');
    //     }
    // }

    const handleEdit = () => {
        navigator(`/post-edit/${id}`);
    }

    return (
        <div className="post-detail-page">
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            {post.photos && post.photos.length > 0 && (
                <img src={`http://localhost:5000${post.photos[0].photo_url}`}
                alt={post.title}
                style={{width:'300px'}}
                />
            )}
            <p>{post.tags}</p>
            <button onClick={handleEdit}>수정</button>
            {/* <button onClick={deleteHandle}>삭제</button> */}
        </div>
    )
}

export default PostDetailPage;