import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleContentChange = (e) => {
        setContent(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const postData = { title, content };

        axios
            .post('http://localhost:5000/api/posts', postData)
            .then((response) => {
                // 게시글 작성 성공 시 홈 페이지로 리디렉션
                navigate('/');
            })
            .catch((err) => {
                console.error('Error creating post:', err);
            })
    }

    return (
        <div>
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={handleContentChange}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Create Post</button>
                </div>
            </form>
        </div>
    )
}

export default CreatePostPage;
