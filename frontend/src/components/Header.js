// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // react-router-dom을 사용하여 라우팅

const Header = () => {
  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <h1>My Board</h1> {/* 사이트 로고 */}
      </div>
      <nav style={navStyle}>
        <ul style={ulStyle}>
          <li><Link to="/" style={linkStyle}>Home</Link></li> {/* 홈 링크 */}
          <li><Link to="/create" style={linkStyle}>Create Post</Link></li> {/* 게시글 작성 페이지 링크 */}
        </ul>
      </nav>
    </header>
  );
};

// 스타일을 객체로 정의 (이건 스타일을 외부 파일로 분리할 수도 있지만, 간단하게 여기서 처리)
const headerStyle = {
  padding: '20px',
  backgroundColor: '#333',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle = {
  fontSize: '24px',
};

const navStyle = {
  fontSize: '18px',
};

const ulStyle = {
  listStyleType: 'none',
  margin: '0',
  padding: '0',
  display: 'flex',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  margin: '0 10px',
};

export default Header;
