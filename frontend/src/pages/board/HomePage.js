import React, { useEffect, useState } from 'react';
import { getAllPosts, searchPost } from '../../service/photo/photoService.js';
import PostCard from '../../components/PostCard.js';
import Pagination from '../../components/Pagination.js';
import Sidebar from '../../components/Sidebar.js';
import styles from '../../assets/styles/HomePage.module.css';
import '../../assets/styles/Pagination.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // 게시물 리스트
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(''); // 디바운싱된 검색어
  const [searchTriggered, setSearchTriggered] = useState(false); // 검색 버튼이 눌렸는지 여부

  // ⏳ 디바운싱 적용
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 📌 게시물 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        if (searchTriggered && debouncedQuery) {
          console.log('🔍 검색 실행 (버튼 클릭됨):', debouncedQuery);
          data = await searchPost(debouncedQuery);
        } else {
          data = await getAllPosts(currentPage, 10);
        }

        setPosts(data.posts || []);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError('페이지 로드 실패');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchTriggered]); // 🔍 검색 버튼이 눌려야 실행됨!

  // 🔎 검색 버튼 클릭 시 실행
  const handleSearch = () => {
    setSearchTriggered(true);
    setCurrentPage(1); // 검색 시 1페이지로 이동
  };
  if (loading) return <p>Loading.......</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.homePage}>
      <Sidebar />
      <div className={styles.postTitleBox}>
        <div className={styles.postBigTitleSearch}>
          <p className={styles.postBigTitle}>A Love Story in Pages</p>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="검색어를 입력해주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.postSearchInput}
              disabled
            />
            <button
              onClick={handleSearch}
              className={styles.postSearchButton}
              disabled
            >
              검색
            </button>
          </div>
        </div>
        <div className={styles.postSubTitleButton}>
          <p className={styles.postSubTitle}>
            Share your special moments and keep them alive
          </p>
          <Link to="/upload">
            <button className={styles.postCreateButton}>Create Post</button>
          </Link>
        </div>
      </div>

      <div className={styles.postList}>
        {posts.length === 0 ? (
          <p>게시물이 없습니다</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
      <Pagination
        posts={posts}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default HomePage;
