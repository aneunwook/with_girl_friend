import React, { useEffect, useState } from 'react';
import { getPosts } from '../../service/borad/postService';
import PostCard from '../../components/PostCard';
import Pagination from '../../components/Pagination'; // Pagination 컴포넌트 임포트
import '../../assets/styles/HomePage.css';
import { useNavigate } from 'react-router-dom';

//로그인 후 토큰 상태 점검 (클라이언트)
const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPosts(currentPage, 10);
        setPosts(data.posts || []);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Error fetching posts');
        setLoading(false);
      }
    };
    fetchPost();
  }, [currentPage]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          posts={posts}
        />
      </div>
    </div>
  );
};

export default HomePage;
