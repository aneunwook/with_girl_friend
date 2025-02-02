import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deletePostWithPhotos,
  getPostDetails,
} from '../../service/photo/photoService.js';
import '../../assets/styles/PostDetailPage.css';

const PostDetailPage = () => {
  const { id } = useParams(); // URL의 'id' 파라미터 추출
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostDetails(id);
        setPost(data);
      } catch (error) {
        setError('Error fetching post: ', error);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const deleteHandle = async () => {
    try {
      await deletePostWithPhotos(id);
      alert('게시글이 삭제 되었습니다');
      navigator('/');
    } catch (error) {
      console.error('게시물 삭제 중 에러발생', error);
      alert('게시글 삭제 실패');
    }
  };

  const handleEdit = () => {
    navigator(`/post-edit/${id}`);
  };

  return (
    <div className="post-detail-page">
      <h1>{post.title}</h1>

      {/* {post.photos &&
        post.photos.length > 0 &&
        post.photos.map((photo, index) => (
          <img
            key={index}
            src={`http://localhost:5000${photo.photo_url}`}
            alt={`Photo ${index + 1}`}
            style={{ width: '300px', marginRight: '10px' }}
          />
        ))} */}
      {/* HTML에서 텍스트만 추출 */}
      {/* <p>
        {
          new DOMParser().parseFromString(post.description, 'text/html').body
            .innerText
        }
      </p> */}
    
    <div
    dangerouslySetInnerHTML={{ __html: post.description }}
    style={{ whiteSpace: 'pre-wrap' }} // 줄바꿈을 유지하려면 이 스타일 추가
  />

      <p>{post.tags}</p>
      <button onClick={handleEdit}>수정</button>
      <button onClick={deleteHandle}>삭제</button>
    </div>
  );
};

export default PostDetailPage;
