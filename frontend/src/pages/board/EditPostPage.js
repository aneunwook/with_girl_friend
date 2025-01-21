import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axiosInstance from '../../service/axiosInstance'; // Axios 인스턴스
import { updatePostWithPhotos, getPostDetails } from '../../service/photo/photoService'; // 서비스 함수
import '../../assets/styles/EditPost.css';

const EditPostPage = () => {
  const { id } = useParams(); // URL에서 게시글 ID 추출
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    tags: '',
  });
  const [content, setContent] = useState('');
  const [photoUrls, setPhotoUrls] = useState([]); // 기존 및 새 이미지 URL 저장
  const [message, setMessage] = useState('');

  // 게시글 데이터 로드
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostDetails(id); // API에서 게시글 데이터 가져오기
        console.log('Fetched Post Data:', data); // 응답 데이터 구조 확인

        setFormData({ title: data.title, tags: data.tags });
        setContent(data.description);
        setPhotoUrls(data.photoUrls || []); // 기존 이미지 URL
      } catch (err) {
        console.error('Failed to fetch post details:', err);
        setMessage('게시글 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPost();
  }, [id]);

  // Quill 에디터 이미지 핸들러
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
          const imageUrl = reader.result;
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, 'image', imageUrl);

          setPhotoUrls((prev) => [...prev, imageUrl]); // 새 이미지 URL 저장
        };
        reader.readAsDataURL(file);
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
      handlers: { image: imageHandler },
    },
  }), []);

  const formats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'image'];

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setMessage('내용을 입력해주세요!');
      return;
    }

    const updatedData = {
      title: formData.title,
      tags: formData.tags,
      description: content.trim(),
      photoUrls: photoUrls.filter((url) => url), // 유효한 이미지 URL만
    };

    try {
      await updatePostWithPhotos(id, updatedData); // 게시글 수정 API 호출
      setMessage('게시글이 성공적으로 수정되었습니다!');
      navigate('/'); // 홈으로 이동
    } catch (err) {
      console.error('Failed to update post:', err.response?.data || err.message);
      setMessage('게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="post-form">
      <form onSubmit={handleSubmit}>
        <div className="post-title">
          <h1>게시글 수정하기</h1>
          <button type="submit">저장</button>
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
            onChange={setContent}
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

export default EditPostPage;
