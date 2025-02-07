import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import CreatePostPage from './pages/board/CreatePostPage.js';
import HomePage from './pages/board/HomePage.js';
import EditPostPage from './pages/board/EditPostPage.js';
import PostDetailPage from './pages/board/PostDetailPage.js';
import Header from './components/Header.js';
import LoginForm from './components/LoginForm.js';
import SignUpRoutes from './routes/SignUpRoutes.js'
import { SignUpProvider } from './pages/Auth/SignUpContext.js';
import AnniversaryPage from './pages/anniversary/AnniversaryPage.js';
import TripPage from './pages/trip/TripPage.js';
import AddTripPage from './pages/trip/AddTripPage.js';
import TripEditPage from './pages/trip/TripEditPage.js';

function App() {
  return (
    <AuthProvider>
      <SignUpProvider>
      <Router>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/upload" element={<CreatePostPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/photos/:id" element={<PostDetailPage />} />
            <Route path="/post-edit/:id" element={<EditPostPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signUp/*">{SignUpRoutes} </Route>
            <Route path="/anniversary" element={<AnniversaryPage />} />
            <Route path="/trips" element={<TripPage />} />
            <Route path="/add" element={<AddTripPage />} />
            <Route path="/editTrip/:id" element={<TripEditPage />} />
          </Routes>
        </div>
      </Router>
      </SignUpProvider>
    </AuthProvider>
  );
}

export default App;
