import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../service/axiosInstance';

const AddTripPage = ({onTripAdded}) => {
    const [formData, setFormData] = useState({
        name : '',
        address : '',
        memo : '',
        additionalMemos : [''],
    });

    const [photos, setPhotos] = useState([]); //모든 업로드 된 사진들
    const [showModal, setShowModal] = useState(false); // 모달 상태
    const [previewPhoto, setPreviewPhoto] = useState(null); // 미리보기 용 사진

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value})
    }

    const handleMemoChange = (index, value) => {
        const updateMemos = [...formData.additionalMemos];
        updateMemos[index] = value;
        setFormData({...formData, additionalMemos: updateMemos});
    }

    const addMemo = () => {
        setFormData({...formData, additionalMemos : [...formData.additionalMemos, '']})
    }

    const removeMemo = (index) => {
        const updatedMemos = [...formData.additionalMemos];
        updatedMemos.splice(index, 1);
        setFormData({...formData, additionalMemos: updatedMemos})
    }

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos((prevPhoto) => [...prevPhoto, ...files]);
    }

    
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: 사진 업로드
      const photoData = new FormData();
      photos.forEach((file) => photoData.append('trip', file));

      const uploadResponse = await axiosInstance.post('/trips/tripPhoto', photoData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { photo_url, additionalPhotos } = uploadResponse.data;

      // Step 2: 여행지 추가
      const tripData = {
        name: formData.name,
        address: formData.address,
        memo: formData.memo,
        photo_url,
        additionalPhotos,
        additionalMemos: formData.additionalMemos,
      };

      const addResponse = await axiosInstance.post('/trips/add', tripData);
      console.log('Add Trip Response:', addResponse.data);

      if (onTripAdded) {
        onTripAdded(addResponse.data.trip); // 부모 컴포넌트에 추가된 여행지 정보 전달
      }

      // 폼 초기화
      setFormData({
        name: '',
        address: '',
        memo: '',
        additionalMemos: [''],
      });
      setPhotos([]);
    } catch (error) {
      console.error('Error adding trip:', error);
    }
  };

    return(
        <form onSubmit={handleSubmit}>
            <div>
                <input 
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='여행지의 이름을 입력해 주세요'
                required
                />
            </div>
            <div>
                <input 
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    placeholder='주소를 입력해 주세요'
                />
            </div>
            <div>
                <input 
                    type='file'
                    name='trip'
                    placeholder='추가 할 사진들을 넣어 주세요'
                    multiple
                    onChange={handlePhotoChange}
                />
            </div>
            <div>
                <input 
                    type='text'
                    name='memo'
                    value={formData.memo}
                    placeholder='내용을 적어 주세요'
                    onChange={handleChange}
                />
            </div>
            <div>
          <label>추가 메모들:</label>
          {formData.additionalMemos.map((memo, index) => (
            <div key={index}>
              <input
                type="text"
                value={memo}
                onChange={(e) => handleMemoChange(index, e.target.value)}
              />
              <button type="button" onClick={() => removeMemo(index)}>
                삭제
              </button>
            </div>
          ))}
          <button type="button" onClick={addMemo}>
            추가 메모 추가
          </button>
        </div>
        <button type="submit">여행지 추가</button>
      </form>
    )
}

export default AddTripPage;