import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPostWithPhotos } from '../../service/photo/photoService';
import '../../assets/styles/CreatePost.css';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const contentRef = useRef(null); // contenteditable div에 접근하기 위한 ref
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
  });
  const [files, setFiles] = useState([]); // 파일 객체 저장
  const [content, setContent] = useState(''); // contenteditable 내용
  const [message, setMessage] = useState('');

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const div = document.getElementById('editableDiv');
        const img = document.createElement('img');
        img.src = reader.result;
        img.alt = 'uploaded';
        img.style.margin = '5px';
        img.contentEditable = false; // 이미지 수정 불가
        div.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  };

  // 텍스트 영역 변경 핸들러
  const handleContentChange = () => {
    const div = document.getElementById('editableDiv');
    setContent(div.innerHTML); // div의 HTML 내용을 상태로 저장
  };
  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      user_id: 1, // 실제 사용자 ID
      title: formData.title,
      description: content,
      tags: formData.tags,
    };
    console.log('FormData to send:', data);

    try {
      const response = await createPostWithPhotos(data, files);
      setMessage('게시물 등록을 완료했습니다');
      console.log(response);
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err.response?.data || err.message);
      setMessage(
        err.response?.data?.error ||
          'An error occurred while creating the post.'
      );
    }
  };

  // 커서 초기화 핸들러
  const setCursorToStart = () => {
    const element = contentRef.current;
    if (element) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(element); // 노드 전체 선택
      range.collapse(true); // 커서를 시작점으로 설정
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  // 페이지 로드 또는 컴포넌트가 렌더링될 때 커서를 초기화
  useEffect(() => {
    setCursorToStart();
  }, []);

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
        <div className="img-parent">
          <input
            type="file"
            id="file"
            className="photo-input"
            name="photos"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <label htmlFor="file" className="photo-label">
            <i className="fa-regular fa-image"></i>
          </label>
        </div>
        <div
          id="editableDiv"
          ref={contentRef} // ref로 연결
          contentEditable
          data-placeholder="내용을 입력하거나 이미지를 추가해주세요..."
          onInput={handleContentChange} // 텍스트 변경 시 호출
        ></div>
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
