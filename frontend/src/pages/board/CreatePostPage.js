import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createPostWithPhotos } from '../../service/photo/photoService';

const CreatePostPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title : "",
        description : "",
        tags : "",
    });
    const [files, setFiles] = useState([]);
    const [message, setMessage] = useState("");

    // 폼 데이터 변경 핸들러
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value });
    }

    //파일 선택 핸들러
    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files)) //여러 파일을 배열로 저장
    }

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            user_id: 1, // 실제 사용자 ID
            title: formData.title,
            description: formData.description,
            tags: formData.tags,
        };
        console.log("FormData to send:", data);
        
        try{
            const response = await createPostWithPhotos(data, files);
            setMessage("게시물 등록을 완료했습니다");
            console.log(response);
            navigate('/');   
        }catch (err) {
            console.error('Error creating post:', err.response?.data || err.message);
            setMessage(err.response?.data?.error || 'An error occurred while creating the post.');
        }
    }

    return (
        <div>
            <h1>게시물 등록하기</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type='text'
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='tags'>Tags:</label>
                    <input 
                        type='text'
                        name='tags'
                        value={formData.tags}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor='photos'>Photos:</label>
                    <input 
                        type='file'
                        name='photos'
                        multiple
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <button type="submit">등록</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default CreatePostPage;
