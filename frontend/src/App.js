// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import PostEditPage from './pages/EditPostPage';
import EditPostPage from './pages/EditPostPage';

function App() {
  return (
    <Router>
      <Header /> {/* Header 컴포넌트를 페이지 상단에 배치 */}

      <div className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePostPage />} />
          {/* 추가적으로 다른 페이지들 (게시글 수정, 상세 등) 라우트 설정 */}
          <Route path='/posts/:id' element={<PostDetailPage/>}/>
          <Route path='/edit-post/:id' element={<EditPostPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
