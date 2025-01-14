import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import CreatePostPage from "./pages/board/CreatePostPage.js";
import HomePage from "./pages/board/HomePage.js"
import EditPostPage from "./pages/board/EditPostPage.js";
import PostDetailPage from "./pages/board/PostDetailPage.js";
import Header from "./components/Header.js";
import LoginPage from "./pages/Auth/SignInPage.js";
import SignUpPage from "./pages/Auth/SignUpPage.js";
import AnniversaryPage from "./pages/anniversary/AnniversaryPage.js";

function App() {
    return (
        <Router>
            <Header/>
            <div className="content">
                <Routes>
                    <Route path="/upload" element={<CreatePostPage />}/>
                    <Route path="/" element={<HomePage />}/>
                    <Route path="/posts/:id" element={<PostDetailPage/>}/>
                    <Route path="/edit-post/:id" element={<EditPostPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/signUp" element={<SignUpPage/>}/>
                    <Route path="/anniversary" element={<AnniversaryPage />}/>
                </Routes>
            </div>
        </Router>
    )
}

export default App;