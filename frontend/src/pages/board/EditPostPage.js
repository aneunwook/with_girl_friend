import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { updatePost,getPostsById } from "../../service/borad/postService";

const EditPostPage = () => {
    const {id} = useParams();
    const [post, setPost] = useState({title : '', content: ''});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try{
                const data = await getPostsById(id);
                setPost({title : data.title, content: data.content});
            }catch(err){
                console.log('Error fetching post:', err);
            }
        } 
        fetchPost();
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            await updatePost(id, post.title, post.content)
            alert('게시물이 수정되었습니다');
            navigate('/')
        }catch(err){
            console.error('Error updating post:', err);
            alert('게시물 수정 실패');
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name] : value,
        }))
    }

    return(
        <div className="post-edit-page">
            <h1>게시글 수정</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title"> 제목 </label>
                    <input type="text" id="title" name="title"
                    value={post.title} onChange={handleChange} required/>
                </div>
                <div>
                    <label htmlFor="content"> 내용 </label>
                    <input type="text" id="content" name="content"
                    value={post.content} onChange={handleChange} required/>
                </div>
                <button type="submit">수정하기</button>
            </form>
        </div>
    )
}
export default EditPostPage;  // 컴포넌트 이름을 맞추어 export