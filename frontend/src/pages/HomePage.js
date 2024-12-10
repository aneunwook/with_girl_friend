import React, { useEffect, useState } from "react";
import { getPosts } from "../service/postService";
import PostCard from "../components/PostCard";
import "../assets/styles/HomePage.css"

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () =>{
            try{
                const data = await getPosts();
                console.log("Fetched data:", data); 
                setPosts(data);
            }catch(err){
                console.error("Error fetching posts:", err);
            }
        }
        fetchPosts();
    }, [])
    return(
        <div>
            <h1>Home Page</h1>
            <div>
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    posts.map((post) => (
                        <PostCard key={post.id}
                        post={post}/>
                    ))
                )}
            </div>
        </div>
    )
}

export default HomePage;