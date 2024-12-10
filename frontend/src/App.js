import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import CreatePostPage from "./pages/CreatePostPage.js";
import HomePage from "./pages/HomePage.js"
import EditPostPage from "./pages/EditPostPage.js";
import PostDetailPage from "./pages/PostDetailPage.js";
import Header from "./components/Header.js";

function App() {
    return (
        <Router>
            <Header/>
            <div className="content">
                <Routes>
                <Route path="/create" element={<CreatePostPage />}/>
                <Route path="/" element={<HomePage />}/>
                <Route path="/posts/:id" element={<PostDetailPage/>}/>
                <Route path="/edit-post/:id" element={<EditPostPage/>}/>
                </Routes>
            </div>
        </Router>
    )
}

export default App;