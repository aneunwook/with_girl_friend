import React, {useState, useEffect} from 'react';
import PostCard from '../components/PostCard';
import {getPosts} from '../service/postService';
// src/pages/HomePage.js
import '../assets/styles/HomePage.css';  // 추가


const HomePage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try{
                const data = await getPosts();
                setPosts(data);
            }catch(error){
                console.error("Error fetching posts:", error);
            }
        }
        fetchPosts();
    },[])
    return(
        <div>
            <h1>Home Page</h1>
            <div>
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    )
}
export default HomePage;