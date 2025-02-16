import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import CreatePostPage from './pages/board/CreatePostPage.js';
import HomePage from './pages/board/HomePage.js';
import EditPostPage from './pages/board/EditPostPage.js';
import PostDetailPage from './pages/board/PostDetailPage.js';
import Header from './components/Header.js';
import LoginForm from './components/LoginForm.js';
import SignUpRoutes from './routes/SignUpRoutes.js';
import { SignUpProvider } from './pages/Auth/SignUpContext.js';
import AnniversaryPage from './pages/anniversary/AnniversaryPage.js';
import TripPage from './pages/trip/TripPage.js';
import AddTripPage from './pages/trip/AddTripPage.js';
import TripEditPage from './pages/trip/TripEditPage.js';
import MainPage from './components/MainPage.js';
import PlaylistPage from './pages/playlist/PlaylistPage.js';
import PlaylistSongsPage from './pages/playlist/PlaylistSongPage.js';
import LoginSuccess from './pages/playlist/LoginSuccess.js';

function App() {
  const handleLogin = () => {
    const CLIENT_ID = '7ba200b021fc4af9b605f684d5be25e7';
    const REDIRECT_URI = 'http://localhost:3000/api/auth/callback'; // 백엔드 OAuth 콜백 URL
    const SCOPES = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
      'streaming', // 음악 스트리밍을 위해 필요
    ];

    console.log('🔑 로그인 버튼 클릭됨!'); // ✅ 실행 여부 체크
    localStorage.removeItem('spotify_access_token'); // 기존 토큰 삭제
    localStorage.removeItem('spotify_refresh_token');
    localStorage.setItem('redirectTo', '/playlist'); // 로그인 후 이동할 경로 저장

    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(SCOPES.join(' '))}` +
      `&show_dialog=true`;

    window.location.href = authUrl; // Spotify 로그인 페이지로 이동
  };
  return (
    <AuthProvider>
      <SignUpProvider>
        <Router>
          <Header />
          <div className="content">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/upload" element={<CreatePostPage />} />
              <Route path="/post" element={<HomePage />} />
              <Route path="/photos/:id" element={<PostDetailPage />} />
              <Route path="/post-edit/:id" element={<EditPostPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signUp/*">{SignUpRoutes} </Route>
              <Route path="/anniversary" element={<AnniversaryPage />} />
              <Route path="/trips" element={<TripPage />} />
              <Route path="/add" element={<AddTripPage />} />
              <Route path="/editTrip/:id" element={<TripEditPage />} />
              <Route path="/login-success" element={<LoginSuccess />} />
              <Route
                path="/playlist"
                element={<PlaylistPage handleLogin={handleLogin} />}
              />
              <Route
                path="/playlist/:playlistId"
                element={<PlaylistSongsPage />}
              />
            </Routes>
          </div>
        </Router>
      </SignUpProvider>
    </AuthProvider>
  );
}

export default App;
