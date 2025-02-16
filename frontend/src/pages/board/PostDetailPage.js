import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deletePostWithPhotos,
  getPostDetails,
} from '../../service/photo/photoService.js';
import styles from '../../assets/styles/PostDetailPage.module.css';

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

  const tags = Array.isArray(post?.tags) > 0 ? post.tags : [];

  return (
    <div className={styles.postDetailPage}>
      <div className={styles.postDetailPageTitleBox}>
        <p className={styles.postDetailPageTitle}>제목</p>
        <h1 className={styles.postDetailPageTitleName}>{post.title}</h1>
      </div>

      <div className={styles.postNameCreated}>
        <div className={styles.postNameBox}>
          <p className={styles.postName}>작성자</p>
          <p className={styles.postRealName}>{post.author.name}</p>
        </div>

        <div className={styles.postCreatedBox}>
          <p className={styles.postCreated}>작성일</p>{' '}
          <p className={styles.postRealCreated}>
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className={styles.postImgBox}>
        <div
          dangerouslySetInnerHTML={{ __html: post.description }}
          style={{ whiteSpace: 'pre-wrap' }} // 줄바꿈을 유지하려면 이 스타일 추가
        />
      </div>

      <div className={styles.tagsContainer}>
        {tags.length > 0 && (
          <p className={styles.tags}>
            {tags.map((tags, index) => (
              <span key={index} className={styles.tag}>
                {' '}
                #{tags}&nbsp;
              </span>
            ))}
          </p>
        )}
      </div>
      <hr className={styles.hrBar}></hr>
      <div className={styles.postEditDeleteButton}>
        <button onClick={handleEdit} className={styles.postEditButton}>
          수정
        </button>
        <button onClick={deleteHandle} className={styles.postDeleteButton}>
          삭제
        </button>
      </div>
    </div>
  );
};

export default PostDetailPage;

{
  /* {post.photos &&
        post.photos.length > 0 &&
        post.photos.map((photo, index) => (
          <img
            key={index}
            src={`http://localhost:5000${photo.photo_url}`}
            alt={`Photo ${index + 1}`}
            style={{ width: '300px', marginRight: '10px' }}
          />
        ))} */
}
{
  /* HTML에서 텍스트만 추출 */
}
{
  /* <p>
        {
          new DOMParser().parseFromString(post.description, 'text/html').body
            .innerText
        }
      </p> */
}
