// src/pages/CreatePostPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate
import axios from 'axios';

function CreatePostPage() {
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이터

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 제목을 변경할 때 호출되는 함수
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // 내용 변경할 때 호출되는 함수
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // 폼 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const postData = { title, content };

    axios
      .post('http://localhost:5000/api/posts', postData) // API 요청 (서버의 /api/posts 엔드포인트로 POST)
      .then((response) => {
        // 게시글 작성 성공 시 홈 페이지로 리디렉션
        navigate('/');
      })
      .catch((err) => {
        console.error('Error creating post:', err);
      });
  };

  return (
    <div>
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            required
          />
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePostPage;
