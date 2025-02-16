import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/styles/HomePage.module.css';
// import noImage from '../assets/styles/image/noImage.jpg';

const PostCard = ({ post }) => {
  console.log('📢 post 데이터:', post);

  // post 또는 post.postPhotos가 없으면 빈 배열로 기본값을 설정
  const photos = post?.postPhotos || [];

  // 첫 번째 이미지 가져오기
  const imageUrl = photos.length > 0 ? photos[0].photo_url : ''; // 이미지가 있으면 URL, 없으면 빈 문자열

  const tags = Array.isArray(post?.tags) ? post.tags : []; // tags가 배열인지 체크하고 배열이 아니면 빈 배열로 설정

  return (
    <Link to={`/photos/${post.id}`} className={styles.goToPostCardLink}>
      <div className={styles.postCard}>
        <div className={styles.postCardImg}>
          <img src={imageUrl} alt="Post Card" className={styles.postImg}></img>
        </div>
        <h3 className={styles.postTitle}>{post.title}</h3>
        <hr></hr>
        <div className={styles.tagsContainer}>
          {tags.length > 0 && (
            <p className={styles.tags}>
              {tags.map((tags, index) => (
                <span key={index} className={styles.tag}>
                  #{tags}&nbsp;
                </span>
              ))}
            </p>
          )}
        </div>
        <p>
          <strong>작성일: </strong>{' '}
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        {/* <button>
        <Link to={`/photos/${post.id}`}>Go to Post</Link>
      </button> */}
      </div>
    </Link>
  );
};

export default PostCard;

//   <Link to='/post' className={styles.boradLink}>
// <div className={styles.postBox}>
// <i class="fa-regular fa-clipboard"></i>
// <span>post</span>
// </div>
// </Link>
