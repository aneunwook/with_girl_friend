import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({post}) => {
    return(
        <div className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p><strong>작성일: </strong> {new Date(post.created_at).toLocaleDateString()}</p>
            <img src={`http://localhost:5000${post.photos[0].photo_url}`} style={{width : '200px'}} alt={post.title}/>
            <button><Link to={`/photos/${post.id}`}>Go to Post</Link></button>
        </div>
    )
}

export default PostCard;