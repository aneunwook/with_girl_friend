import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({post}) => {
    return(
        <div className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p><strong>작성일: </strong> {new Date(post.createAt).toLocaleDateString()}</p>
            <img src={post.photos[0].photo_url} alt={post.title}/>
            <button><Link to={`/posts/${post.id}`}>Go to Post</Link></button>
        </div>
    )
}

export default PostCard;