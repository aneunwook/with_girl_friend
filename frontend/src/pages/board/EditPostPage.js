import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePostWithPhotos } from '../../service/photo/photoService';
import { getPostDetails } from '../../service/photo/photoService'; // 게시물 상세 정보 가져오기
import '../../assets/styles/CreatePost.css';

const UpdatePostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // URL에서 게시물 ID 가져오기

  const contentRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
  });
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [existingPhotos, setExistingPhotos] = useState([]); // 기존 사진 리스트

  // 게시물 상세 정보 가져오기
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const post = await getPostDetails(id); // 게시물 데이터 가져오기
        setFormData({
          title: post.title,
          tags: post.tags,
        });
        setContent(post.description);
        setExistingPhotos(post.photos); // 기존 사진 저장
      } catch (err) {
        console.error('Error fetching post data:', err);
        setMessage('게시물 데이터를 불러오는 데 실패했습니다.');
      }
    };

    fetchPostData();
  }, [id]);

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
        div.appendChild(img); // contenteditable div에 이미지 삽입
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
      title: formData.title,
      description: content,
      tags: formData.tags,
    };

    const photosToDelete = existingPhotos
      .filter(
        (photo) => !photo.isSelected // 삭제할 사진들 선택
      )
      .map((photo) => photo.id);

    try {
      const response = await updatePostWithPhotos(
        id,
        data,
        files,
        photosToDelete
      );
      setMessage('게시물 수정이 완료되었습니다.');
      navigate(`/post/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setMessage('게시물 수정 중 오류가 발생했습니다.');
    }
  };

  // 기존 사진 선택/삭제 처리
  const handlePhotoSelection = (photoId) => {
    setExistingPhotos(
      existingPhotos.map((photo) =>
        photo.id === photoId
          ? { ...photo, isSelected: !photo.isSelected }
          : photo
      )
    );
  };

  // 커서 초기화 핸들러
  const setCursorToStart = () => {
    const element = contentRef.current;
    if (element) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(element);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  useEffect(() => {
    setCursorToStart();
  }, []);

  return (
    <div className="post-form">
      <form onSubmit={handleSubmit}>
        <div className="post-title">
          <h1>게시물 수정하기</h1>
          <button type="submit">수정</button>
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
          ref={contentRef}
          contentEditable
          data-placeholder="내용을 입력하거나 이미지를 추가해주세요..."
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: content }} // content를 div에 반영
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
        <div className="existing-photos">
          {existingPhotos.map((photo) => (
            <div key={photo.id} className="photo-item">
              <img
                src={`http://localhost:5000${photo.photo_url}`} // 서버 주소와 함께 절대 경로로 변환
                alt="photo"
              />
              <input
                type="checkbox"
                checked={photo.isSelected || false}
                onChange={() => handlePhotoSelection(photo.id)}
              />
            </div>
          ))}
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdatePostPage;
