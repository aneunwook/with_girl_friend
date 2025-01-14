import React, { useEffect, useState } from 'react';
import { getAllPosts } from '../../service/photo/photoService.js';
import PostCard from '../../components/PostCard.js';
import Pagination from '../../components/Pagination.js';

const HomePage = () =>{
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]); // 게시물 리스트
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  // 게시물 데이터 가져오기 (API 호출)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try{
        const data = await getAllPosts(currentPage, 10);
        setPosts(data.posts || []);
        setTotalPages(data.totalPages);
      }catch(err){
        setError('페이지 로드 실패');
      }finally{
        setLoading(false)//로딩 종료
      }
    }
    fetchPosts();
  }, [currentPage]) // currentPage 가 변경 될 때마다 호출

  if(loading) return <p>Loading.......</p>;
  if(error) return <p>{error}</p>;

  return(
    <div className='home-page'>
      <h1>HomePage</h1>
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


// import React, { useEffect, useState } from 'react';
// import { getPosts } from '../../service/borad/postService';
// import PostCard from '../../components/PostCard';
// import Pagination from '../../components/Pagination'; // Pagination 컴포넌트 임포트
// import '../../assets/styles/HomePage.css';
// import { useNavigate } from 'react-router-dom';

// //로그인 후 토큰 상태 점검 (클라이언트)
// const HomePage = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let isMounted = true; // 컴포넌트가 마운트 상태인지 확인
//     console.log("useEffect triggered, currentPage:", currentPage);
    
//     const fetchPost = async () => {
//       try {
//         const data = await getPosts(currentPage, 10);
//         if (isMounted) {
//           console.log("Fetched posts:", data.posts);
//           setPosts(data.posts || []);
//           setTotalPages(data.totalPages);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError("Error fetching posts");
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };
  
//     fetchPost();
  
//     return () => {
//       isMounted = false; // 언마운트 시 상태 업데이트 방지
//     };
//   }, [currentPage]);
  

//   if (loading) {
//     return <p>Loading posts...</p>;
//   }

//   if (error) {
//     return <p>{error}</p>;
//   }

//   return (
//     <div>
//       <h1>Home Page</h1>
//       <div>
//         {posts.length === 0 ? (
//           <p>No posts available.</p>
//         ) : (
//           posts.map((post) => <PostCard key={post.id} post={post} />)
//         )}
//         <Pagination
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           totalPages={totalPages}
//           posts={posts}
//         />
//       </div>
//     </div>
//   );
// };

// export default HomePage;
