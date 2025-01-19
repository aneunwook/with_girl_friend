import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Sidebar.css';

//isSidebarOpen: 사이드바의 열림/닫힘 상태를 나타냄.
//toggleSidebar: 사이드바 상태를 변경하는 함수.

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const closeSidebar = (e) => {
    if (!e.target.closest('.sidebar')) {
      toggleSidebar();
    }
  };

  return (
    <div onClick={closeSidebar}>
      {/* 배경 어두워지는 오버레이 */}
      <div
        className={`overlay ${isSidebarOpen ? 'visible' : ''}`}
        onClick={toggleSidebar}
      ></div>

      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* 사이드바 닫기 버튼 */}
        <button className="close-button" onClick={toggleSidebar}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* 사이드바 내용 */}
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/upload">Create Post</Link>
          </li>
          <li>
            <Link to="/anniversary">Anniversary</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
