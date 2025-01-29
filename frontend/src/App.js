import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePostPage from './pages/board/CreatePostPage.js';
import HomePage from './pages/board/HomePage.js';
import EditPostPage from './pages/board/EditPostPage.js';
import PostDetailPage from './pages/board/PostDetailPage.js';
import Header from './components/Header.js';
import LoginPage from './pages/Auth/SignInPage.js';
import SignUpPage from './pages/Auth/SignUpPage.js';
import AnniversaryPage from './pages/anniversary/AnniversaryPage.js';
import TripPage from './pages/trip/TripPage.js';
import AddTripPage from './pages/trip/AddTripPage.js';
import TripEditPage from './pages/trip/TripEditPage.js';

function App() {
  return (
    <Router>
      <Header />
      <div className="content">
        <Routes>
          <Route path="/upload" element={<CreatePostPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/photos/:id" element={<PostDetailPage />} />
          <Route path="/post-edit/:id" element={<EditPostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/anniversary" element={<AnniversaryPage />} />
          <Route path="/trips" element={<TripPage />} />
          <Route path="/add" element={<AddTripPage />} />
          <Route path="/editTrip/:id" element={<TripEditPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
