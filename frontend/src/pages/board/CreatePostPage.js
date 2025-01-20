import React, { useState, useRef, useMemo } from 'react';
import axiosInstance from '../../service/axiosInstance';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createPostWithPhotos } from '../../service/photo/photoService'; // 서비스 함수 임포트
import '../../assets/styles/CreatePost.css';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [photoUrls, setPhotoUrls] = useState([]); // 에디터에서 업로드된 사진 URL 저장

  // Quill 에디터 내용 변경 핸들러
  const handleContentChange = (value) => {
    setContent(value);
    console.log('Editor Content:', value);
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result; // base64 URL
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', imageUrl); // 에디터에 이미지 삽입
  
          // 상태에 이미지 추가
          setPhotoUrls((prevUrls) => [...prevUrls, imageUrl]);
        };
        reader.readAsDataURL(file); // base64로 변환
      }
    };
  };
  
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }], 
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image'],
      ],
      handlers: {
        image: imageHandler, // 이미지를 선택하면 이 핸들러 실행
      },
    },
  }), []);

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'image',
  ], []);

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Quill 에디터와 상태 값 동기화
    if (!content || content.trim() === '') {
      setMessage('내용을 입력해주세요!');
      return;
    }
  
    const data = {
      user_id: 1, // 예시 사용자 ID
      title: formData.title,
      description: content.trim(), // content 값을 description으로 사용
      tags: formData.tags,
      photoUrls: photoUrls.filter((url) => url), // 유효한 URL만 포함
    };
  
    console.log('Form Data to Send:', data); // 데이터 확인
  
    try {
      const response = await createPostWithPhotos(data); // 서비스 함수 호출
      setMessage('게시물이 성공적으로 등록되었습니다!');
      navigate('/'); // 홈으로 이동
    } catch (err) {
      console.error('Error creating post:', err.response?.data || err.message);
      setMessage(
        err.response?.data?.error || '게시물 등록 중 문제가 발생했습니다.'
      );
    }
  };
  

  return (
    <div className="post-form">
      <form onSubmit={handleSubmit}>
        <div className="post-title">
          <h1>게시물 등록하기</h1>
          <button type="submit">등록</button>
        </div>
        <div className="title-input">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="제목을 입력해주세요"
            required
          />
        </div>
        <div>
          <ReactQuill
            className="ReactQuill"
            ref={quillRef}
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력하거나 이미지를 추가해주세요..."
            modules={modules}
            formats={formats}
            theme="snow"
          />
        </div>
        <div className="tags-input">
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={(e) =>
              setFormData({ ...formData, tags: e.target.value })
            }
            placeholder="태그를 입력해주세요"
          />
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePostPage;
