import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 라우팅을 위한 Link
import Sidebar from './Sidebar'; // Sidebar 컴포넌트
import '../assets/styles/Header.css'; // 헤더 스타일

const Header = () => {
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
      </header>

      {/* Sidebar 컴포넌트 */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
