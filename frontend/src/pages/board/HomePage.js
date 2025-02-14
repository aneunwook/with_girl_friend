import React, { useEffect, useState } from 'react';
import { getAllPosts, searchPost } from '../../service/photo/photoService.js';
import PostCard from '../../components/PostCard.js';
import Pagination from '../../components/Pagination.js';
import Sidebar from '../../components/Sidebar.js';
import '../../assets/styles/HomePage.css'
import '../../assets/styles/Pagination.css'

const HomePage = () =>{
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // 게시물 리스트
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
  const [searchQuery, setSearchQuery] = useState('');

  // 게시물 데이터 가져오기 (API 호출)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try{
        let data;
        if(searchQuery){
          data = await searchPost(searchQuery);
        }else{
          data = await getAllPosts(currentPage, 10);
        }
        setPosts(data.posts || []);
        setTotalPages(data.totalPages);
      }catch(err){
        setError('페이지 로드 실패');
      }finally{
        setLoading(false)//로딩 종료
      }
    }
    fetchPosts();
  }, [currentPage, searchQuery]) // currentPage 가 변경 될 때마다 호출

  if(loading) return <p>Loading.......</p>;
  if(error) return <p>{error}</p>;

  return(
    <div className='home-page'>
      <Sidebar />

      <div>
        <input 
          type='text'
          placeholder='검색어를 입력해주세요'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={() => setCurrentPage(1)}>검색</button>
      </div>
      <h1 style={{marginLeft: '20px'}}>Post</h1>
      <div className='post-list'>
        {posts.length === 0 ? (
          <p>게시물이 없습니다</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} /> // 게시물 렌더링
          ))
        )}
      </div>
      <Pagination 
      posts={posts}
      currentPage={currentPage} //현재 페이지
      setCurrentPage={setCurrentPage} // 페이지 변경 함수
      totalPages={totalPages} // 전체 페이지 수
      />
    </div>
  );
};

export default HomePage;
