import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { createPostWithPhotos } from '../../service/photo/photoService';
import '../../assets/styles/CreatePost.css';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
  });
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]); // 파일 객체 저장

  // Quill 에디터 내용 변경 핸들러
  const handleContentChange = (value) => {
    setContent(value);
  };

  // Quill 에디터에서 이미지 삽입 핸들러
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (file) {
        // 선택된 파일을 툴바로 삽입
        const reader = new FileReader();
        reader.onload = (e) => {
          const editor = quillRef.current.getEditor(); // Quill 에디터 인스턴스
          const range = editor.getSelection(); // 현재 커서 위치
          editor.insertEmbed(range.index, 'image', e.target.result); // 이미지 삽입
        };
        reader.readAsDataURL(file); // 파일을 Data URL로 변환

        // 파일을 파일 배열에 추가
        setFiles([...files, file]);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image'], // 이미지 버튼 추가
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'list', 'bullet', 'image',
  ], []);

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      user_id: 1, // 예시로 하드코딩된 사용자 ID
      title: formData.title,
      description: content, // Quill 에디터의 HTML 내용
      tags: formData.tags,
    };

    try {
      const response = await createPostWithPhotos(data, files);
      setMessage('게시물 등록을 완료했습니다.');
      console.log(response);
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err.response?.data || err.message);
      setMessage(
        err.response?.data?.error ||
        '게시물 생성 중 문제가 발생했습니다.'
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
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={handleContentChange}
          placeholder="내용을 입력하거나 이미지를 추가해주세요..."
          modules={modules}
          formats={formats}
          theme="snow"
        />
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
