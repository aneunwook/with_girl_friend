import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import {
  uploadPosts,
  createPostWithPhotos,
} from '../../service/photo/photoService'; // 서비스 함수
import 'react-quill/dist/quill.snow.css';
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
    const formattedContent = value.replace(/\n/g, '<br>');
    setContent(formattedContent);
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const urls = await uploadPosts([file]); // 업로드 서비스 호출
          if (urls && urls[0]) {
            const imageUrl = urls[0]; // 업로드된 상대 경로

            // 절대 경로 변환
            const absoluteImageUrl = `http://localhost:3000${imageUrl}`;

            // Quill 에디터에 이미지 삽입
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();
            if (range) {
              editor.insertEmbed(range.index, 'image', absoluteImageUrl);
            } else {
              console.error('에디터 선택 범위(range)가 유효하지 않습니다.');
            }

            // 상태 업데이트
            setPhotoUrls((prevUrls) => [...prevUrls, absoluteImageUrl]);
          } else {
            console.error('이미지 업로드 후 URL이 비어있습니다:', urls);
          }
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
        }
      }
    };
    input.click();
  };

  // 게시글 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      console.error("🚨 인증 토큰이 없습니다!");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Base64 디코딩
  const userId = decodedToken.id; // JWT에 저장된 사용자 ID 가져오기

  console.log("✅ JWT에서 추출한 사용자 ID:", userId);


    const data = {
      title: formData.title,
      description: content.trim(),
      tags: formData.tags,
      user_id: userId, // 사용자 ID (예시)
      photoUrls, // 업로드된 이미지 URL 리스트
    };

    try {
      await createPostWithPhotos(data); // createPostWithPhotos 서비스 호출
      setMessage('게시글이 등록되었습니다!');
      navigate('/'); // 홈으로 이동
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      setMessage('게시글 등록 중 문제가 발생했습니다.');
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image'],
        ],
        handlers: {
          image: handleImageUpload, // 이미지를 선택하면 이 핸들러 실행
        },
      },
    }),
    []
  );

  const formats = useMemo(
    () => ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'image'],
    []
  );

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
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="태그를 입력해주세요"
          />
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreatePostPage;
