import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; // Sidebar 컴포넌트
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import styles from '../assets/styles/Header.module.css'; // 헤더 스타일

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // 사이드바 상태 토글
  };

  return (
    <>
      <header className={styles.header}>
        {/* 사이드바 토글 버튼 */}
        <button className={styles.toggleButton} onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* 로고 */}
        <div className={styles.logo}>
          <h1>
            <Link to="/">Our Journey</Link>
          </h1>
        </div>

        {/* 네비게이션 */}
        <div className={styles.navContainer}>
          <nav className={styles.navCategory}>
            <ul className={styles.navLinks}>
              <li>
                <Link to="/">Post</Link>
              </li>
              <li>
                <Link to="/trips">Trip</Link>
              </li>
              <li>
                <Link to="/anniversary">Anniversary</Link>
              </li>
            </ul>
          </nav>

          {/* 로그인/로그아웃 버튼 */}
          <div className={styles.auth}>
            {user ? (
              <button className={styles.logout} onClick={logout}>
                LogOut
              </button>
            ) : (
              <Link to="/login" className={styles.headerLogin}>
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      {/* Sidebar 컴포넌트 */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />{' '}
    </>
  );
};

export default Header;
