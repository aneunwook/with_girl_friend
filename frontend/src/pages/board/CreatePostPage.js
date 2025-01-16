import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPostWithPhotos } from '../../service/photo/photoService';

const CreatePostPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tags: "",
    });
    const [files, setFiles] = useState([]); // 파일 객체 저장
    const [previewImages, setPreviewImages] = useState([]); // 이미지 미리 보기 저장
    const [message, setMessage] = useState("");

    // 폼 데이터 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        console.log('Selected files:', selectedFiles); // 파일 배열 확인

         // 미리보기 생성
    const previews = selectedFiles.map((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result); // 파일 로드 완료
            reader.onerror = () => reject('Failed to load file'); // 파일 로드 실패
            reader.readAsDataURL(file); // 파일 읽기
        });
    });

    // 모든 미리보기 URL 로드 후 상태 업데이트
    Promise.all(previews)
        .then((images) => setPreviewImages(images))
        .catch((error) => console.error(error));
    };

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

        try {
            const response = await createPostWithPhotos(data, files);
            setMessage("게시물 등록을 완료했습니다");
            console.log(response);
            navigate('/');
        } catch (err) {
            console.error('Error creating post:', err.response?.data || err.message);
            setMessage(err.response?.data?.error || 'An error occurred while creating the post.');
        }
    };

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
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="tags">Tags:</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label htmlFor="photos">Photos:</label>
                    <input
                        type="file"
                        name="photos"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    {/* 이미지 미리 보기 */}
                    {previewImages.length > 0 && (
                    <div>
                        {previewImages.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`preview-${index}`}
                                style={{ width: '100px', margin: '10px' }}
                            />
                        ))}
                    </div>
                )}
                </div>
                <div>
                    <button type="submit">등록</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default CreatePostPage;
