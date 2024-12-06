import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostsById, updatePost } from "../service/postService";

const EditPostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState({ title: '', content: '' });
    const navigate = useNavigate();

    // 게시물 정보를 가져오는 useEffect
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostsById(id);
                setPost({ title: data.title, content: data.content });
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [id]);

    // 폼 제출 처리 함수
    const handleSubmit = async (e) => {
        e.preventDefault();  // e.preventDefault()로 수정
        try {
            await updatePost(id, post.title, post.content);
            alert('게시물이 수정되었습니다.');
            navigate(`/posts/${id}`);  // 수정 후 상세 페이지로 이동
        } catch (error) {
            console.error('Error updating post:', error);
            alert('게시물 수정 실패');
        }
    };

    // 폼 입력 값 변경 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    return (
        <div className="post-edit-page">
            <h1>게시물 수정</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">내용</label>
                    <textarea
                        id="content"
                        name="content"
                        value={post.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">수정하기</button>
            </form>
        </div>
    );
};

export default EditPostPage;  // 컴포넌트 이름을 맞추어 export
