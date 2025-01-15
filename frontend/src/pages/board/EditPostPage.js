import React,{ useEffect, useState }  from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getPostDetails, updatePostWithPhotos } from "../../service/photo/photoService.js"

const EditPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [newPhotos, setNewPhotos] = useState([]);
    const [photosToDelete, setPhotosToDelete] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try{
                const data = await getPostDetails(id);
                setPost(data);
                setTitle(data.title);
                setDescription(data.description);
                setTags(data.tags);
                setIsPrivate(data.is_private);
            }catch(err){
                console.log('Error fetching post:', err);
            }
        } 
        fetchPost();
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('tags', tags);
        formData.append('is_private', isPrivate);
        photosToDelete.forEach((photoId) => formData.append('photosToDelete[]', photoId));
        newPhotos.forEach((file) => formData.append('newFiles', file));

        try{
            await updatePostWithPhotos(id, FormData)
            alert('게시물이 수정되었습니다');
            navigate('/')
        }catch(err){
            console.error('Error updating post:', err);
            alert('게시물 수정 실패');
        }
    }
    return (
        post && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="설명"
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="태그"
            />
            <label>
              비공개:
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
            </label>
            <div>
              기존 사진 삭제:
              {post.photos.map((photo) => (
                <label key={photo.id}>
                  <input
                    type="checkbox"
                    value={photo.id}
                    onChange={(e) =>
                      setPhotosToDelete((prev) =>
                        e.target.checked
                          ? [...prev, photo.id]
                          : prev.filter((id) => id !== photo.id)
                      )
                    }
                  />
                  <img src={`http://localhost:5000${photo.photo_url}`} alt="사진 미리보기" width={100} />
                </label>
              ))}
            </div>
            <div>
              새 사진 추가:
              <input
                type="file"
                multiple
                onChange={(e) => setNewPhotos([...e.target.files])}
              />
            </div>
            <button type="submit">수정하기</button>
          </form>
        )
      );
    };
export default EditPostPage;  // 컴포넌트 이름을 맞추어 export