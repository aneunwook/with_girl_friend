import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Sidebar from './Sidebar'; // Sidebar 컴포넌트
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import '../assets/styles/Header.css'; // 헤더 스타일

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // 사이드바 상태 토글
  };

  return (
    <>
      <header className="header">
        {/* 사이드바 토글 버튼 */}
        <button className="toggle-button" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* 로고 */}
        <div className="logo">
          <h1>My Board</h1>
        </div>

        <div>
        {user ? (
        <button onClick={logout}>로그아웃</button>
      ) : (
        <Link to="/login">로그인</Link>
      )}
        </div>
      </header>

      {/* Sidebar 컴포넌트 */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
