import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../service/borad/postService';

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 올바른 데이터 객체 생성
    const data = {
        user_id: 1, // 실제 사용자 ID를 동적으로 넣어야 함
        title: title, // 입력받은 제목
        description: content, // 입력받은 내용
        tags: "example,tag", // 태그는 필요한 경우 추가
      };

        try{
            const postData = await createPost( data );
            console.log("post created successfully", postData);
            navigate('/');   
        }catch(err){
            console.error('Error creating post:', err);
            
        }
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
