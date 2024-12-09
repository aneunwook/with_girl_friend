import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import CreatePostPage from "./pages/CreatePostPage.js";
import HomePage from "./pages/HomePage.js"

function App() {
    return (
        <Router>
            <div className="content">
                <Routes>
                <Route path="/create" element={<CreatePostPage />}/>
                <Route path="/" element={<HomePage />}/>
                </Routes>
            </div>
        </Router>
    )
}

export default App;