import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar'; // Sidebar 컴포넌트
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';
import styles from '../assets/styles/Header.module.css'; // 헤더 스타일
import CoupleRegister from '../pages/couple/CoupleRegister.js'

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showCoupleRegister, setShowCoupleRegister] = useState(false); // 🔥 상태 추가

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

          {/* 🔥 커플 등록 버튼 추가 (로그인한 사용자만 보이게) */}
          {user && (
            <button 
              className={styles.coupleRegisterButton} 
              onClick={() => setShowCoupleRegister(!showCoupleRegister)}
            >
              {showCoupleRegister ? "닫기" : "커플 등록"}
            </button>
          )}

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

      {/* 🔥 커플 등록 UI 표시 (버튼 클릭 시 열리고 닫힘) */}
      {showCoupleRegister && <CoupleRegister />}

      {/* Sidebar 컴포넌트 */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />{' '}
    </>
  );
};

export default Header;
